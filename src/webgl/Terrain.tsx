import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { BufferAttribute, PlaneGeometry, ShaderMaterial, Vector2 } from 'three';
import { calmHeight, roughHeight, SITE, TERRAIN_SIZE } from '../lib/terrain';
import { rawColor } from './colors';
import type { SceneDriver } from './driver';

const vertex = /* glsl */ `
  attribute float aRough;
  attribute float aCalm;
  uniform float uOrder;
  varying vec3 vWorld;
  void main() {
    float h = mix(aRough, aCalm, uOrder);
    vec3 p = vec3(position.x, h, position.z);
    vWorld = p;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uOrder;
  uniform float uWarm;
  uniform float uPulse;
  uniform float uTime;
  uniform float uBright;
  uniform vec2 uSite;
  uniform vec3 uBg;
  uniform vec3 uGround;
  uniform vec3 uLine;
  uniform vec3 uAmber;
  varying vec3 vWorld;

  float contour(float f, float width) {
    float fw = fwidth(f);
    float g = abs(fract(f - 0.5) - 0.5) / max(fw, 1e-4);
    return 1.0 - smoothstep(width - 0.5, width + 0.9, g);
  }

  void main() {
    vec3 dx = dFdx(vWorld);
    vec3 dy = dFdy(vWorld);
    vec3 n = normalize(cross(dx, dy));
    if (n.y < 0.0) n = -n;
    float shade = clamp(dot(n, normalize(vec3(-0.45, 0.8, 0.35))), 0.0, 1.0);

    float interval = mix(0.26, 0.443, uOrder);
    float f = vWorld.y / interval + 0.5 * uOrder;
    float minor = contour(f, 0.85);
    float major = contour(f / 5.0, 1.5);

    float dSite = length(vWorld.xz - uSite);
    float r = length(vWorld.xz);
    float fade = 1.0 - smoothstep(13.0, 21.0, r);

    // Warmth gathers at the implementation site, then reach pulses out from it.
    float rad = fract(uTime * 0.085) * 17.0;
    float ring = exp(-pow((dSite - rad) / 0.7, 2.0)) * (1.0 - rad / 17.0) * uPulse;
    float warmth = clamp(uWarm * (1.0 - smoothstep(2.0, 13.0, dSite)) * 1.1 + ring, 0.0, 1.0);

    vec3 ground = mix(uBg, uGround, 0.35 + 0.65 * shade);
    ground = mix(ground, uGround * 1.15, 0.15 * smoothstep(0.0, 3.0, vWorld.y));
    vec3 lineCol = mix(uLine, uAmber, warmth);

    float heightGain = 0.8 + 0.2 * smoothstep(0.0, 2.6, vWorld.y);
    float a = (minor * 0.55 + major * 0.9) * heightGain;
    a += ring * 0.55 * (minor + major);
    vec3 col = mix(ground, lineCol, clamp(a, 0.0, 1.0));
    col += uAmber * (ring * 0.14 + uWarm * (1.0 - smoothstep(0.0, 6.5, dSite)) * 0.07);
    col *= uBright;
    col = mix(uBg, col, fade);
    gl_FragColor = vec4(col, 1.0);
  }
`;

interface Props {
  driver: SceneDriver;
  mobile: boolean;
}

/** The ground: a contour map that is turbulent at first, becomes terraced as it is understood, and warms where services land. */
export function Terrain({ driver, mobile }: Props) {
  const geometry = useMemo(() => {
    const seg = mobile ? 150 : 230;
    const g = new PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, seg, seg);
    g.rotateX(-Math.PI / 2);
    const pos = g.getAttribute('position');
    const rough = new Float32Array(pos.count);
    const calm = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      rough[i] = roughHeight(x, z);
      calm[i] = calmHeight(x, z);
    }
    g.setAttribute('aRough', new BufferAttribute(rough, 1));
    g.setAttribute('aCalm', new BufferAttribute(calm, 1));
    return g;
  }, [mobile]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uOrder: { value: 0 },
          uWarm: { value: 0 },
          uPulse: { value: 0 },
          uTime: { value: 0 },
          uBright: { value: 1 },
          uSite: { value: new Vector2(SITE.cx, SITE.cz) },
          uBg: { value: rawColor('#0A1628') },
          uGround: { value: rawColor('#12294A') },
          uLine: { value: rawColor('#35D6CF') },
          uAmber: { value: rawColor('#E3A94B') },
        },
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    driver.update(state.clock.elapsedTime, delta);
    const m = material;
    const w = driver.w;
    m.uniforms.uOrder!.value = w.order;
    m.uniforms.uWarm!.value = w.warm;
    m.uniforms.uPulse!.value = w.pulse;
    m.uniforms.uTime!.value = state.clock.elapsedTime;
    // The ground steps back while layers of evidence or documents are the subject.
    m.uniforms.uBright!.value = 1 - 0.42 * Math.max(w.strata, w.docs * 0.7, w.systems * 0.35 * (1 - w.hero));
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
