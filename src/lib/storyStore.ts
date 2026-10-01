import { useSyncExternalStore } from 'react';

export type FocusGroup = 'systems' | 'evidence';
export interface Focus {
  group: FocusGroup;
  index: number;
}

/**
 * Shared between the DOM lists (which set it) and the WebGL scene (which reads it every frame).
 * Kept outside React state so the canvas never forces a re-render.
 */
class StoryStore {
  focus: Focus | null = null;
  private listeners = new Set<() => void>();

  setFocus = (focus: Focus | null) => {
    const same =
      (focus === null && this.focus === null) ||
      (focus !== null && this.focus !== null && focus.group === this.focus.group && focus.index === this.focus.index);
    if (same) return;
    this.focus = focus;
    this.listeners.forEach((l) => l());
  };

  subscribe = (cb: () => void) => {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  };

  getSnapshot = () => this.focus;
}

export const storyStore = new StoryStore();

export function useFocus(): Focus | null {
  return useSyncExternalStore(storyStore.subscribe, storyStore.getSnapshot, () => null);
}
