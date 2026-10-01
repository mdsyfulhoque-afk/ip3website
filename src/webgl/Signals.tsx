import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  LineSegments,
  ShaderMaterial,
} from 'three';
import { rawColor } from './colors';
import type { SceneDriver } from './driver';
import { generateSignals, linkArcs, nodes } from './world-data';

const vertex = /* glsl */ `
  attribute vec3 aScatter;
  attribute vec3 aLink;
  attribute vec3 aStrata;
  attribute vec3 aPattern;
  attribute vec3 aFlow;
  attribute vec3 aServe;
  attribute float aRand;
  attribute float aAmber;
  uniform float uU;
  uniform float uTime;
  uniform float uScale;
  uniform float uSize;
  uniform float uHero;
  varying float vAmber;
  varying float vAlpha;

  float step_(float k, float r) {
    float s = k - 1.0 + 0.08 + r * 0.38;
    return smoothstep(s, s + 0.42, uU);
  }

  void main() {
    float r = aRand;
    float m1 = step_(1.0, r);
    float m2 = step_(2.0, r);
    float m3 = step_(3.0, r);
    float m4 = step_(4.0, r);
    float m5 = step_(5.0, r);

    vec3 p = aScatter;
    p = mix(p, aLink, m1);
    p = mix(p, aStrata, m2);
    p = mix(p, aPattern, m3);
    p = mix(p, aFlow, m4);
    p = mix(p, aServe, m5);

    // Signals lift as they travel, so a change of state reads as movement and not a cross-fade.
    float travel = m1 * (1.0 - m1) + m2 * (1.0 - m2) + m3 * (1.0 - m3) + m4 * (1.0 - m4) + m5 * (1.0 - m5);
    p.y += travel * 1.6 * (r - 0.3);

    // How loose each state is: scattered and drifting at first, settled once it has a place.
    float settled = m1 * 0.65 + m2 * 0.2 + m3 * 0.1 + m4 * 0.0 + m5 * 0.05;
    float t = uTime * (0.35 + r * 0.5);
    float amp = mix(0.32, 0.05, clamp(settled + (1.0 - m1) * 0.0, 0.0, 1.0));
    p += vec3(sin(t + r * 31.0), cos(t * 0.9 + r * 17.0) * 0.6, sin(t * 0.8 + r * 53.0)) * amp;

    vAmber = aAmber * smoothstep(3.2, 4.5, uU);
    float groundSignal = (1.0 - aAmber) * smoothstep(4.2, 5.3, uU);
    vAlpha = mix(0.9, 0.18, groundSignal);
    vAlpha *= mix(1.0, 0.55, uHero);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = uSize * (0.7 + r * 0.8) * mix(1.0, 1.5, vAmber);
    gl_PointSize = clamp(size * uScale / -mv.z, 1.5, 22.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform vec3 uCyan;
  uniform vec3 uAmber;
  varying float vAmber;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float core = 1.0 - smoothstep(0.0, 0.45, d);
    float glow = pow(1.0 - d, 2.0);
    vec3 col = mix(uCyan, uAmber, vAmber);
    float a = (core * 0.9 + glow * 0.45) * vAlpha;
    gl_FragColor = vec4(col * (0.8 + core * 0.6), a);
  }
`;

interface Props {
  driver: SceneDriver;
  mobile: boolean;
}

/** Thousands of signals that move between the story's states on the GPU: scattered, linked, layered, patterned, flowing, serving. */
export function Signals({ driver, mobile }: Props) {
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const d = generateSignals(mobile ? 900 : 1900);
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(d.scatter, 3));
    g.setAttribute('aScatter', new BufferAttribute(d.scatter, 3));
    g.setAttribute('aLink', new BufferAttribute(d.link, 3));
    g.setAttribute('aStrata', new BufferAttribute(d.strata, 3));
    g.setAttribute('aPattern', new BufferAttribute(d.pattern, 3));
    g.setAttribute('aFlow', new BufferAttribute(d.flow, 3));
    g.setAttribute('aServe', new BufferAttribute(d.serve, 3));
    g.setAttribute('aRand', new BufferAttribute(d.rand, 1));
    g.setAttribute('aAmber', new BufferAttribute(d.amber, 1));
    return g;
  }, [mobile]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uU: { value: 0 },
          uTime: { value: 0 },
          uScale: { value: 400 },
          uSize: { value: 0.1 },
          uHero: { value: 1 },
          uCyan: { value: rawColor('#35D6CF') },
          uAmber: { value: rawColor('#E3A94B') },
        },
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useEffect(() => {
    // Point size in pixels for a one-unit object at distance 1: tied to the drawing buffer so signals keep their look at any DPR.
    material.uniforms.uScale!.value = size.height * dpr * 0.62;
  }, [material, size.height, dpr]);

  useFrame((state, delta) => {
    driver.update(state.clock.elapsedTime, delta);
    material.uniforms.uU!.value = driver.u;
    material.uniforms.uTime!.value = state.clock.elapsedTime;
    material.uniforms.uHero!.value = driver.w.hero;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={5} />;
}

/* ------------------------------------------------------------------ links between systems */

const lineVertex = /* glsl */ `
  attribute float aT;
  attribute float aPhase;
  varying float vT;
  varying float vPhase;
  void main() {
    vT = aT;
    vPhase = aPhase;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lineFragment = /* glsl */ `
  precision highp float;
  uniform float uOpacity;
  uniform float uTime;
  uniform vec3 uColor;
  varying float vT;
  varying float vPhase;
  void main() {
    float run = fract(vT - uTime * 0.12 - vPhase);
    float pulse = exp(-pow((run - 0.5) / 0.09, 2.0));
    float a = (0.28 + pulse * 0.7) * uOpacity;
    gl_FragColor = vec4(mix(uColor, vec3(1.0, 0.96, 0.88), pulse * 0.6), a);
  }
`;

export function Links({ driver }: { driver: SceneDriver }) {
  const lines = useMemo(() => {
    const pos: number[] = [];
    const t: number[] = [];
    const ph: number[] = [];
    linkArcs.forEach((arc, ai) => {
      const phase = (ai * 0.37) % 1;
      const n = arc.points.length;
      for (let i = 0; i < n - 1; i++) {
        const a = arc.points[i]!;
        const b = arc.points[i + 1]!;
        pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
        t.push(i / (n - 1), (i + 1) / (n - 1));
        ph.push(phase, phase);
      }
    });
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3));
    g.setAttribute('aT', new BufferAttribute(new Float32Array(t), 1));
    g.setAttribute('aPhase', new BufferAttribute(new Float32Array(ph), 1));
    const m = new ShaderMaterial({
      vertexShader: lineVertex,
      fragmentShader: lineFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uOpacity: { value: 0 }, uTime: { value: 0 }, uColor: { value: rawColor('#35D6CF') } },
    });
    const ls = new LineSegments(g, m);
    ls.frustumCulled = false;
    ls.renderOrder = 4;
    return ls;
  }, []);

  const nodePoints = useMemo(() => {
    const g = new BufferGeometry();
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => arr.set([n.x, n.y, n.z], i * 3));
    g.setAttribute('position', new BufferAttribute(arr, 3));
    return g;
  }, []);

  const nodeMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: /* glsl */ `
          uniform float uScale;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = clamp(0.5 * uScale / -mv.z, 6.0, 60.0);
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          uniform float uOpacity;
          uniform vec3 uColor;
          void main() {
            float d = length(gl_PointCoord - 0.5) * 2.0;
            if (d > 1.0) discard;
            float ring = 1.0 - smoothstep(0.0, 0.1, abs(d - 0.5));
            float core = 1.0 - smoothstep(0.0, 0.3, d);
            float glow = pow(1.0 - d, 2.0) * 0.4;
            gl_FragColor = vec4(uColor, (ring * 0.8 + core + glow) * uOpacity);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uOpacity: { value: 0 }, uScale: { value: 400 }, uColor: { value: rawColor('#F2EFE5') } },
      }),
    [],
  );

  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  useEffect(() => {
    nodeMaterial.uniforms.uScale!.value = size.height * dpr * 0.62;
  }, [nodeMaterial, size.height, dpr]);

  useEffect(
    () => () => {
      lines.geometry.dispose();
      (lines.material as ShaderMaterial).dispose();
      nodePoints.dispose();
      nodeMaterial.dispose();
    },
    [lines, nodePoints, nodeMaterial],
  );

  useFrame((state, delta) => {
    driver.update(state.clock.elapsedTime, delta);
    const o = driver.w.links;
    const m = lines.material as ShaderMaterial;
    m.uniforms.uOpacity!.value = o;
    m.uniforms.uTime!.value = state.clock.elapsedTime;
    lines.visible = o > 0.01;
    nodeMaterial.uniforms.uOpacity!.value = o;
  });

  return (
    <>
      <primitive object={lines} />
      <points geometry={nodePoints} material={nodeMaterial} frustumCulled={false} renderOrder={6} />
    </>
  );
}
