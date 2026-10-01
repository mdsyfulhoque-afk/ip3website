import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import { PerspectiveCamera, Vector3 } from 'three';
import type { SceneDriver } from './driver';
import { CAMERA_KEYS } from './world-data';

const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

interface Props {
  driver: SceneDriver;
  mobile: boolean;
  reduced: boolean;
}

/**
 * The camera follows the scene coordinate between keyframes. On wide screens the scene is shifted
 * right so the text column stays clear; on phones it is pulled back and lifted above the text.
 */
export function CameraRig({ driver, mobile, reduced }: Props) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const pos = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  const a = useMemo(() => new Vector3(), []);
  const b = useMemo(() => new Vector3(), []);

  const aspect = size.width / size.height;
  const fit = aspect >= 1.55 ? 1 : 1 + (1.55 - aspect) * 0.82;

  useEffect(() => {
    // Shift the rendered image: right on wide screens (text sits left), up on phones (text sits below).
    if (aspect >= 1.1) {
      const shift = Math.min(0.17, 0.05 + (aspect - 1.1) * 0.12);
      camera.setViewOffset(size.width, size.height, -size.width * shift, 0, size.width, size.height);
    } else {
      camera.setViewOffset(size.width, size.height, 0, size.height * 0.2, size.width, size.height);
    }
    return () => camera.clearViewOffset();
  }, [camera, size.width, size.height, aspect]);

  useFrame((state, delta) => {
    driver.update(state.clock.elapsedTime, delta);
    const u = Math.min(Math.max(driver.u, 0), CAMERA_KEYS.length - 1);
    const i = Math.min(Math.floor(u), CAMERA_KEYS.length - 2);
    const t = smoother(u - i);
    const k0 = CAMERA_KEYS[i]!;
    const k1 = CAMERA_KEYS[i + 1]!;
    pos.set(...k0.pos).lerp(a.set(...k1.pos), t);
    look.set(...k0.look).lerp(b.set(...k1.look), t);

    // Pull back from the look target when the screen is narrow so the whole layout fits.
    pos.sub(look).multiplyScalar(fit).add(look);

    if (!reduced) {
      const tm = state.clock.elapsedTime;
      pos.x += Math.sin(tm * 0.21) * 0.28 + state.pointer.x * (mobile ? 0 : 0.55);
      pos.y += Math.sin(tm * 0.17) * 0.12 + state.pointer.y * (mobile ? 0 : 0.22);
    }
    camera.position.copy(pos);
    camera.lookAt(look);
  });

  return null;
}
