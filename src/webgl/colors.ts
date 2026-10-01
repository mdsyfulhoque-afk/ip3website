import { Color, LinearSRGBColorSpace } from 'three';

/**
 * Colours for hand-written shaders. Those shaders write straight to the screen with no colour-space
 * conversion, so the hex value must reach them unconverted. This keeps the brand palette exact.
 */
export const rawColor = (hex: string) => new Color().setStyle(hex, LinearSRGBColorSpace);
