import type { ReactNode } from 'react';

/**
 * Room for the sector map's longest label. The map's own viewBox is a little narrow for "Climate and energy",
 * so the drawing is allowed to overflow into this padding instead of being clipped.
 */
export function MapFrame({ children }: { children: ReactNode }) {
  return <div className="pr-6 sm:pr-12 [&_svg]:overflow-visible">{children}</div>;
}
