import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { CanvasTexture, DoubleSide, type Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, Vector3 } from 'three';
import { mulberry32 } from '../lib/terrain';
import type { SceneDriver } from './driver';
import { flowCurve } from './world-data';

const COUNT = 6;

/** An abstract policy document: a heading, a block of text lines, a table and a mark. No real words, nothing to misread. */
function drawSheet(seed: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 340;
  const g = c.getContext('2d')!;
  const rnd = mulberry32(seed);
  g.fillStyle = '#EDE9DD';
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = '#0A1628';
  g.fillRect(22, 24, 96, 10);
  g.fillStyle = '#086569';
  g.fillRect(22, 42, 52, 4);
  g.fillStyle = 'rgba(10,22,40,0.55)';
  for (let i = 0; i < 9; i++) {
    const w = 130 + rnd() * 100;
    g.fillRect(22, 68 + i * 13, Math.min(w, 212), 4);
  }
  // table
  g.strokeStyle = 'rgba(10,22,40,0.6)';
  g.lineWidth = 1.5;
  g.strokeRect(22, 196, 212, 70);
  for (let i = 1; i < 4; i++) {
    g.beginPath();
    g.moveTo(22, 196 + i * 17.5);
    g.lineTo(234, 196 + i * 17.5);
    g.stroke();
  }
  g.beginPath();
  g.moveTo(22 + 212 / 3, 196);
  g.lineTo(22 + 212 / 3, 266);
  g.stroke();
  g.fillStyle = 'rgba(10,22,40,0.45)';
  for (let i = 0; i < 3; i++) g.fillRect(34, 204 + i * 17.5, 40 + rnd() * 20, 3);
  // decision mark
  g.fillStyle = '#C98A1E';
  g.beginPath();
  g.arc(206, 306, 14, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#EDE9DD';
  g.fillRect(199, 304, 14, 4);
  g.fillStyle = 'rgba(10,22,40,0.4)';
  g.fillRect(22, 300, 84, 4);
  g.fillRect(22, 310, 60, 4);
  return c;
}

const tmp = new Vector3();
const tan = new Vector3();

/** Policy: documents travel along the route from decision towards the institutions, then land. */
export function Documents({ driver, reduced }: { driver: SceneDriver; reduced: boolean }) {
  const refs = useRef<(Mesh | null)[]>([]);
  const geometry = useMemo(() => new PlaneGeometry(1.05, 1.4), []);
  const materials = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const tex = new CanvasTexture(drawSheet(101 + i * 13));
        tex.colorSpace = SRGBColorSpace;
        tex.anisotropy = 4;
        return new MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, side: DoubleSide, depthWrite: false });
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    },
    [geometry, materials],
  );

  useFrame((state, delta) => {
    driver.update(state.clock.elapsedTime, delta);
    const w = driver.w;
    const time = reduced ? 0 : state.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const mat = materials[i]!;
      const visible = w.docs > 0.01;
      m.visible = visible;
      if (!visible) return;
      const t = reduced ? (i + 0.5) / COUNT : (time * 0.045 + i / COUNT) % 1;
      flowCurve.getPointAt(t, tmp);
      flowCurve.getTangentAt(t, tan);
      m.position.copy(tmp);
      // Sheets face roughly towards the camera, banking gently with the path as they travel.
      m.rotation.set(-0.25 + Math.sin(time * 0.4 + i) * 0.04, -0.35 - tan.x * 0.12, -tan.y * 0.5 + Math.sin(time * 0.3 + i * 2) * 0.03);
      const land = 1 - 0.55 * smooth(0.78, 1, t);
      m.scale.setScalar(land * (0.8 + 0.2 * Math.sin(i * 1.7) ** 2 + 0.15));
      const edge = smooth(0, 0.12, t) * (1 - smooth(0.5, 0.7, t));
      mat.opacity = w.docs * 0.6 * edge;
    });
  });

  return (
    <group>
      {materials.map((mat, i) => (
        <mesh
          key={i}
          ref={(m) => void (refs.current[i] = m)}
          geometry={geometry}
          material={mat}
          frustumCulled={false}
          renderOrder={3}
        />
      ))}
    </group>
  );
}

function smooth(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
