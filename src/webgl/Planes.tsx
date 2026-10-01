import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import {
  BoxGeometry,
  DoubleSide,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  type Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
} from 'three';
import { systems } from '../content/journey';
import { storyStore } from '../lib/storyStore';
import { rawColor } from './colors';
import type { SceneDriver } from './driver';
import { PANE, paneLayout, STRATA, STRATA_POS, strataLayout, SYSTEM_PATTERN } from './world-data';

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * One shader draws every layer. Each pattern is a different way of arranging information,
 * so layers can be told apart by texture and not only by colour.
 */
const fragment = /* glsl */ `
  precision highp float;
  uniform float uOpacity;
  uniform float uFocus;
  uniform float uTime;
  uniform float uPattern;
  uniform vec2 uSize;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying vec2 vUv;

  float aa(float d, float w) {
    float fw = fwidth(d);
    return 1.0 - smoothstep(w - fw, w + fw, d);
  }

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }

  float pattern(vec2 p) {
    // p is in world units across the layer
    if (uPattern < 0.5) {
      vec2 g = abs(fract(p / 0.5 - 0.5) - 0.5) * 0.5;
      return max(aa(g.x, 0.012), aa(g.y, 0.012)) * 0.75;
    }
    if (uPattern < 1.5) {
      vec2 c = fract(p / 0.34 - 0.5) - 0.5;
      return aa(length(c) * 0.34, 0.05) * 0.9;
    }
    if (uPattern < 2.5) {
      float d = abs(fract((p.x + p.y) / 0.3) - 0.5) * 0.3;
      return aa(d, 0.012) * 0.7;
    }
    if (uPattern < 3.5) {
      float d = abs(fract(length(p * vec2(0.8, 1.0)) / 0.5 - 0.5) - 0.5) * 0.5;
      return aa(d, 0.014) * 0.8;
    }
    if (uPattern < 4.5) {
      float y = p.y + sin(p.x * 1.6 + uTime * 0.25) * 0.16 + sin(p.x * 3.7) * 0.05;
      float d = abs(fract(y / 0.32 - 0.5) - 0.5) * 0.32;
      return aa(d, 0.014) * 0.8;
    }
    // cells
    vec2 q = p * 1.15;
    vec2 i = floor(q);
    vec2 f = fract(q);
    float d1 = 8.0;
    float d2 = 8.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 g = vec2(float(x), float(y));
        vec2 o = hash2(i + g);
        float d = length(g + o - f);
        if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
      }
    }
    return aa(d2 - d1, 0.045) * 0.85;
  }

  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float pat = pattern(p);

    // outline of the layer
    vec2 e = min(vUv, 1.0 - vUv) * uSize;
    float edge = aa(min(e.x, e.y), 0.018);

    // the pattern fades towards the edges so each layer reads as a patch of information
    float inner = smoothstep(0.0, 0.7, min(e.x, e.y));
    vec3 col = uColor;
    float focusMix = uFocus;
    col = mix(col, uAccent, focusMix * 0.55);

    float fill = 0.045 + 0.03 * uFocus;
    float a = fill + pat * 0.34 * inner + edge * 0.85;
    a *= uOpacity * (1.0 + uFocus * 1.15);
    gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
  }
`;

function usePatternMaterial(size: [number, number], pattern: number) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        uniforms: {
          uOpacity: { value: 0 },
          uFocus: { value: 0 },
          uTime: { value: 0 },
          uPattern: { value: pattern },
          uSize: { value: new Vector2(size[0], size[1]) },
          uColor: { value: rawColor('#35D6CF') },
          uAccent: { value: rawColor('#F2EFE5') },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  return material;
}

interface Props {
  driver: SceneDriver;
}

function Pane({ index, driver }: { index: number; driver: SceneDriver }) {
  const p = paneLayout[index]!;
  const material = usePatternMaterial([PANE.w, PANE.h], SYSTEM_PATTERN[p.id]);
  const mesh = useRef<Mesh>(null);
  const geometry = useMemo(() => new PlaneGeometry(PANE.w, PANE.h), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const focusRef = useRef(0);

  useFrame((state, delta) => {
    driver.update(state.clock.elapsedTime, delta);
    const f = storyStore.focus;
    const dim = f && f.group === 'systems' ? (f.index === index ? 1 : 0) : -1;
    focusRef.current += ((dim === 1 ? 1 : 0) - focusRef.current) * (1 - Math.exp(-delta * 8));
    const w = driver.w;
    const faded = dim === 0 ? 0.45 : 1;
    material.uniforms.uOpacity!.value = w.systems * faded;
    material.uniforms.uFocus!.value = focusRef.current * (w.systems > 0.5 ? 1 : 0);
    material.uniforms.uTime!.value = state.clock.elapsedTime;
    if (mesh.current) mesh.current.visible = w.systems > 0.01;
  });

  return (
    <group position={[p.x, p.y, p.z]} rotation={[0, p.rotY, 0]}>
      <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} renderOrder={index} />
    </group>
  );
}

/** Complexity: six systems as upright layers, each patterned differently. */
export function SystemLayers({ driver }: Props) {
  return (
    <>
      {systems.map((s, i) => (
        <Pane key={s.id} index={i} driver={driver} />
      ))}
    </>
  );
}

function Stratum({ index, driver }: { index: number; driver: SceneDriver }) {
  const l = strataLayout[index]!;
  const material = usePatternMaterial([STRATA.w, STRATA.d], l.type);
  const group = useRef<Mesh>(null);
  const focusRef = useRef(0);
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(STRATA.w, STRATA.d);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const edges = useMemo(() => {
    const box = new BoxGeometry(STRATA.w, 0.1, STRATA.d);
    const g = new EdgesGeometry(box);
    box.dispose();
    const m = new LineBasicMaterial({ color: '#35D6CF', transparent: true, opacity: 0, depthWrite: false });
    return new LineSegments(g, m);
  }, []);
  useEffect(
    () => () => {
      geometry.dispose();
      edges.geometry.dispose();
      (edges.material as LineBasicMaterial).dispose();
    },
    [geometry, edges],
  );

  useFrame((state, delta) => {
    driver.update(state.clock.elapsedTime, delta);
    const f = storyStore.focus;
    const dim = f && f.group === 'evidence' ? (f.index === index ? 1 : 0) : -1;
    focusRef.current += ((dim === 1 ? 1 : 0) - focusRef.current) * (1 - Math.exp(-delta * 8));
    const w = driver.w;
    const faded = dim === 0 ? 0.4 : 1;
    material.uniforms.uOpacity!.value = w.strata * faded;
    material.uniforms.uFocus!.value = focusRef.current;
    material.uniforms.uTime!.value = state.clock.elapsedTime;
    const em = edges.material as LineBasicMaterial;
    em.opacity = w.strata * 0.7 * faded + focusRef.current * 0.3;
    em.color.set(dim === 1 ? '#F2EFE5' : '#35D6CF');
    edges.visible = w.strata > 0.01;
    if (group.current) group.current.visible = w.strata > 0.01;
  });

  return (
    <group position={[STRATA_POS.x, l.y, STRATA_POS.z]} rotation={[0, STRATA_POS.rotY, 0]}>
      <mesh ref={group} geometry={geometry} material={material} frustumCulled={false} renderOrder={index} />
      <primitive object={edges} />
    </group>
  );
}

/** Evidence: five slabs, one per kind of evidence, stacked and lifted as the story reaches them. */
export function EvidenceStrata({ driver }: Props) {
  return (
    <>
      {strataLayout.map((_, i) => (
        <Stratum key={i} index={i} driver={driver} />
      ))}
    </>
  );
}
