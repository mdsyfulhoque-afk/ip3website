import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useMotion } from '../lib/motion';
import { CameraRig } from './CameraRig';
import { Documents } from './Documents';
import { SceneDriver } from './driver';
import { Institutions } from './Institutions';
import { Labels } from './Labels';
import { EvidenceStrata, SystemLayers } from './Planes';
import { Links, Signals } from './Signals';
import { Terrain } from './Terrain';

interface Props {
  target: MutableRefObject<number>;
  run: boolean;
  mobile: boolean;
  onReady: () => void;
  onLost: () => void;
}

/** Tells the page the canvas has painted a few frames, so it can fade in over the static poster without a flash. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) onReady();
  });
  return null;
}

/** Lowers the pixel ratio once if frames are slow. It never removes the scene. */
function Governor({ floor }: { floor: number }) {
  const acc = useRef({ t: 0, n: 0, done: false });
  useFrame((state, delta) => {
    const a = acc.current;
    if (a.done) return;
    a.t += Math.min(delta, 0.5);
    a.n += 1;
    if (a.n < 90) return;
    const avg = a.t / a.n;
    a.t = 0;
    a.n = 0;
    if (avg > 1 / 32) {
      const next = Math.max(floor, state.viewport.dpr * 0.78);
      state.setDpr(next);
      if (next <= floor) a.done = true;
    } else {
      a.done = true;
    }
  });
  return null;
}

export default function World({ target, run, mobile, onReady, onLost }: Props) {
  const { reducedMotion } = useMotion();
  const driver = useMemo(() => new SceneDriver(target), [target]);
  const cleanup = useRef<() => void>(() => {});
  useEffect(() => () => cleanup.current(), []);

  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 1.6]}
      frameloop={run ? 'always' : 'never'}
      camera={{ fov: 38, near: 0.1, far: 90, position: [0, 3, 16.5] }}
      gl={{ antialias: !mobile, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#0A1628', 1);
        const el = gl.domElement;
        const lost = (e: Event) => {
          e.preventDefault();
          onLost();
        };
        el.addEventListener('webglcontextlost', lost);
        cleanup.current = () => el.removeEventListener('webglcontextlost', lost);
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <CameraRig driver={driver} mobile={mobile} reduced={reducedMotion} />
      <Terrain driver={driver} mobile={mobile} />
      <SystemLayers driver={driver} />
      <EvidenceStrata driver={driver} />
      <Links driver={driver} />
      <Institutions driver={driver} />
      <Documents driver={driver} reduced={reducedMotion} />
      <Signals driver={driver} mobile={mobile} />
      {mobile ? null : <Labels driver={driver} />}
      <ReadySignal onReady={onReady} />
      <Governor floor={mobile ? 0.8 : 0.9} />
    </Canvas>
  );
}
