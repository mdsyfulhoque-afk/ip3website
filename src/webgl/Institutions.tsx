import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { BoxGeometry, InstancedBufferAttribute, type InstancedMesh, Matrix4, ShaderMaterial } from 'three';
import { terrainHeight } from '../lib/terrain';
import { rawColor } from './colors';
import type { SceneDriver } from './driver';
import { generateSite } from './world-data';

const vertex = /* glsl */ `
  attribute float aDelay;
  attribute float aMain;
  uniform float uRise;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vMain;
  varying float vShown;
  void main() {
    vUv = uv;
    vNormal = normalize(mat3(instanceMatrix) * normal);
    vMain = aMain;
    float k = smoothstep(aDelay * 0.55, aDelay * 0.55 + 0.45, uRise);
    vShown = k;
    vec4 p = vec4(position, 1.0);
    p.y *= max(k, 0.001);
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * p;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uOpacity;
  uniform vec3 uFill;
  uniform vec3 uEdge;
  uniform vec3 uAmber;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vMain;
  varying float vShown;
  void main() {
    vec2 d = min(vUv, 1.0 - vUv) / max(fwidth(vUv), vec2(1e-4));
    float edge = 1.0 - smoothstep(0.9, 2.0, min(d.x, d.y));
    float top = smoothstep(0.5, 1.0, vNormal.y);
    vec3 fill = mix(uFill * 0.85, uFill * 1.45 + uAmber * vMain * 0.1, top);
    vec3 line = mix(uEdge, uAmber, vMain);
    vec3 col = mix(fill, line, edge);
    gl_FragColor = vec4(col + uAmber * vMain * top * 0.12, uOpacity * vShown * mix(0.78, 0.98, vMain));
  }
`;

interface Props {
  driver: SceneDriver;
}

/** Practice: institutions and the households around them rise out of the ordered ground. */
export function Institutions({ driver }: Props) {
  const mesh = useRef<InstancedMesh>(null);
  const site = useMemo(() => generateSite(), []);

  const geometry = useMemo(() => {
    const g = new BoxGeometry(1, 1, 1);
    g.translate(0, 0.5, 0);
    g.setAttribute('aDelay', new InstancedBufferAttribute(new Float32Array(site.buildings.map((b) => b.delay)), 1));
    g.setAttribute('aMain', new InstancedBufferAttribute(new Float32Array(site.buildings.map((b) => (b.h > 0.6 ? 1 : 0))), 1));
    return g;
  }, [site]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        uniforms: {
          uRise: { value: 0 },
          uOpacity: { value: 0 },
          uFill: { value: rawColor('#10284A') },
          uEdge: { value: rawColor('#35D6CF') },
          uAmber: { value: rawColor('#E3A94B') },
        },
      }),
    [],
  );

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const mat = new Matrix4();
    site.buildings.forEach((b, i) => {
      const y = terrainHeight(b.x, b.z, 1) - 0.04;
      mat.makeScale(b.w, b.h, b.d).setPosition(b.x, y, b.z);
      m.setMatrixAt(i, mat);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [site]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, delta) => {
    driver.update(state.clock.elapsedTime, delta);
    const w = driver.w;
    material.uniforms.uRise!.value = w.rise;
    material.uniforms.uOpacity!.value = w.buildings;
    if (mesh.current) mesh.current.visible = w.buildings > 0.01;
  });

  return (
    <group>
      <instancedMesh ref={mesh} args={[geometry, material, site.buildings.length]} frustumCulled={false} renderOrder={2} />
    </group>
  );
}
