import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { evidenceLayers, systems } from '../content/journey';
import { smoothstep } from '../lib/terrain';
import { storyStore } from '../lib/storyStore';
import type { SceneDriver } from './driver';
import { generateSite, nodes, STRATA, STRATA_POS, strataLayout } from './world-data';

type Anchor = 'left' | 'right' | 'center';

interface Item {
  text: string;
  position: Vector3;
  anchor: Anchor;
  /** 0 hidden, 1 fully shown. */
  opacity: (driver: SceneDriver) => number;
  /** Set when this label belongs to the item the reader has selected in the page. */
  focused?: () => boolean;
}

const OFFSET: Record<Anchor, string> = {
  left: 'translate(12px, -50%)',
  right: 'translate(calc(-100% - 12px), -50%)',
  center: 'translate(-50%, -50%)',
};

/**
 * Labels are plain DOM elements positioned by projecting 3D points each frame. Type stays crisp,
 * there are no extra React roots, and opacity is written straight to the element.
 */
export function Labels({ driver }: { driver: SceneDriver }) {
  const gl = useThree((s) => s.gl);
  const layer = useRef<HTMLDivElement | null>(null);
  const els = useRef<HTMLDivElement[]>([]);
  const v = useMemo(() => new Vector3(), []);

  const items = useMemo<Item[]>(() => {
    const out: Item[] = [];
    systems.forEach((s, i) => {
      out.push({
        text: s.name,
        position: nodes[i]!.clone(),
        anchor: 'left',
        opacity: (d) => smoothstep(0.55, 1, d.w.systems) * (1 - d.w.hero) * (1 - smoothstep(1.55, 1.95, d.u)),
        focused: () => storyStore.focus?.group === 'systems' && storyStore.focus.index === i,
      });
    });
    const cos = Math.cos(STRATA_POS.rotY);
    const sin = Math.sin(STRATA_POS.rotY);
    evidenceLayers.forEach((l, i) => {
      // The front-right corner of each slab, so labels line up down the right-hand edge of the stack.
      const lx = STRATA.w / 2 - 0.25;
      const lz = STRATA.d / 2;
      out.push({
        text: l.name,
        position: new Vector3(STRATA_POS.x + lx * cos + lz * sin, strataLayout[i]!.y + 0.08, STRATA_POS.z - lx * sin + lz * cos),
        anchor: 'right',
        opacity: (d) => smoothstep(0.6, 1, d.w.strata),
        focused: () => storyStore.focus?.group === 'evidence' && storyStore.focus.index === i,
      });
    });
    generateSite().clusters.forEach((c, i) => {
      out.push({
        text: c.name,
        position: new Vector3(c.x, c.top + 0.4, c.z),
        anchor: 'center',
        opacity: (d) => d.w.siteLabels * smoothstep(0.45 + i * 0.08, 0.95, d.w.rise),
      });
    });
    return out;
  }, []);

  useEffect(() => {
    const parent = gl.domElement.parentElement;
    if (!parent) return;
    const root = document.createElement('div');
    root.setAttribute('aria-hidden', 'true');
    root.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none';
    const created = items.map((it) => {
      const el = document.createElement('div');
      el.className = 'gl-label';
      el.textContent = it.text;
      el.style.cssText = 'position:absolute;left:0;top:0;opacity:0;visibility:hidden;will-change:transform,opacity';
      root.appendChild(el);
      return el;
    });
    parent.appendChild(root);
    layer.current = root;
    els.current = created;
    return () => {
      root.remove();
      layer.current = null;
      els.current = [];
    };
  }, [gl, items]);

  useFrame((state, delta) => {
    driver.update(state.clock.elapsedTime, delta);
    const { width, height } = state.size;
    const f = storyStore.focus;
    for (let i = 0; i < items.length; i++) {
      const el = els.current[i];
      if (!el) continue;
      const it = items[i]!;
      let o = it.opacity(driver);
      const isFocused = it.focused?.() ?? false;
      if (f && it.focused && !isFocused) o *= 0.4;
      v.copy(it.position).project(state.camera);
      if (o < 0.02 || v.z > 1) {
        if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden';
        continue;
      }
      const x = (v.x * 0.5 + 0.5) * width;
      const y = (-v.y * 0.5 + 0.5) * height;
      el.style.visibility = 'visible';
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) ${OFFSET[it.anchor]}`;
      el.dataset.focused = isFocused ? 'true' : 'false';
    }
  });

  return null;
}
