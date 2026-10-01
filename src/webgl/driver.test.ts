import { describe, expect, it } from 'vitest';
import { roughHeight, terrainHeight } from '../lib/terrain';
import { SceneDriver, weightsFor } from './driver';

describe('weightsFor', () => {
  it('keeps every weight between 0 and 1 along the whole journey', () => {
    for (let u = 0; u <= 6; u += 0.05) {
      for (const [k, v] of Object.entries(weightsFor(u))) {
        expect(v, `${k} at u=${u.toFixed(2)}`).toBeGreaterThanOrEqual(0);
        expect(v, `${k} at u=${u.toFixed(2)}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it('shows each scene’s layer at its own scene and hides the others', () => {
    expect(weightsFor(0).hero).toBe(1);
    expect(weightsFor(1).systems).toBe(1);
    expect(weightsFor(2).strata).toBe(1);
    expect(weightsFor(3).strata).toBe(0);
    expect(weightsFor(4).docs).toBe(1);
    expect(weightsFor(5).buildings).toBe(1);
    expect(weightsFor(6).pulse).toBe(1);
  });
});

describe('SceneDriver', () => {
  it('approaches its target without overshooting and settles exactly', () => {
    const target = { current: 3 };
    const d = new SceneDriver(target);
    let prev = d.u;
    for (let i = 1; i < 600; i++) {
      d.update(i / 60, 1 / 60);
      expect(d.u).toBeGreaterThanOrEqual(prev);
      expect(d.u).toBeLessThanOrEqual(3);
      prev = d.u;
    }
    expect(d.u).toBe(3);
  });

  it('does nothing twice in the same frame', () => {
    const d = new SceneDriver({ current: 6 });
    d.update(1, 0.016);
    const after = d.u;
    d.update(1, 0.016);
    expect(d.u).toBe(after);
  });
});

describe('terrain', () => {
  it('is deterministic and keeps the implementation site flat', () => {
    expect(roughHeight(3.3, -4.1)).toBe(roughHeight(3.3, -4.1));
    expect(terrainHeight(2.6, 1.2, 0)).toBeCloseTo(0.22, 5);
    expect(terrainHeight(2.6, 1.2, 1)).toBeCloseTo(0.22, 5);
  });
});
