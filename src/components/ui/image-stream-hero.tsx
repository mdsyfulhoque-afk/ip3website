"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

/* ── the corridor ────────────────────────────────────────────────
 * Two rails of cards ride from far behind the screen toward the
 * viewer. Perspective alone does the work that looks like two
 * animations: as a card's z grows it gets bigger *and* its screen x
 * sweeps outward from the vanishing point, because the projection
 * scales position and size by the same factor.
 *
 * Three things shape it, and each one fixes a specific artefact:
 *
 * 1. Depth is authored as *apparent size*, geometrically — each card
 *    is a constant ratio bigger than the one behind it, all the way
 *    out. Spacing a straight z-range evenly instead makes the near
 *    cards tear apart from each other as the projection blows up.
 * 2. The rails open hard in the first stretch and then hold
 *    (`fan` > 1). That opening cancels the — still slow — growth back
 *    there, so the ribbon leaves the centre as a flat band, bends
 *    once, and only then runs out on the diagonal. Parallel rails
 *    project to a straight cone with no bend at all.
 * 3. Neither end of the loop is ever on screen. A card dies with its
 *    inner edge past 50cqw, clear of the container's edge. And it is
 *    born *across* the axis — `railBirth` is negative, so the newest
 *    card starts on the far side and sweeps back through the centre.
 *    That plugs the throat: the axis stays covered at every instant,
 *    and a newborn lands behind cards that already cover it, so it
 *    needs no fade in. Birthing on its own side instead leaves a hole
 *    at dead centre that blinks open once every cycle.
 *
 * Every length is in `cqw` — a percentage of the container's width —
 * so the whole corridor keeps its proportions at any size. The
 * defaults were fitted numerically against a reference recording's
 * card-height and edge-position profile, not eyeballed.
 * ─────────────────────────────────────────────────────────────── */

export type CorridorPath = {
  /** Strength of the projection. Lower is a wider-angle, more dramatic rush. @default 30 */
  perspective?: number;
  /** Card width in world units. @default 18 */
  cardWidth?: number;
  /** Card height in world units. @default 25 */
  cardHeight?: number;
  /** Corner radius applied to each card. @default 0.4 */
  cardRadius?: number;
  /** On-screen card height at the waist, where a card is born. @default 2.6 */
  birthHeight?: number;
  /** On-screen card height as a card leaves the frame. @default 46 */
  exitHeight?: number;
  /**
   * Lateral offset at birth. Negative starts the card across the axis so the
   * centre never opens up — see note 3 above. @default -11
   */
  railBirth?: number;
  /** Lateral offset once the rails have finished opening. @default 44 */
  railExit?: number;
  /** How front-loaded the opening is. >1 opens early then holds. @default 3.3 */
  fan?: number;
  /** Y-rotation at birth, degrees. @default 6 */
  turnBirth?: number;
  /** Y-rotation at exit, degrees. @default 28 */
  turnExit?: number;
  /** Keyframe stops used to trace the curve. Raise only if motion looks faceted. @default 24 */
  stops?: number;
};

export const DEFAULT_CORRIDOR_PATH: Required<CorridorPath> = {
  perspective: 30,
  cardWidth: 18,
  cardHeight: 25,
  cardRadius: 0.4,
  birthHeight: 2.6,
  exitHeight: 46,
  railBirth: -11,
  railExit: 44,
  fan: 3.3,
  turnBirth: 6,
  turnExit: 28,
  stops: 24,
};

/** Sample the path once so the CSS keyframes trace the real curve. */
export function generateCorridorKeyframes(
  dir: 1 | -1,
  name: string,
  p: Required<CorridorPath>,
  reverse: boolean = false
) {
  const steps: string[] = [];
  for (let s = 0; s <= p.stops; s++) {
    const rawU = s / p.stops;
    const u = reverse ? 1 - rawU : rawU;
    // Geometric in apparent size, so consecutive cards keep a constant size
    // ratio and the ribbon stays solid at both ends.
    const scale =
      (p.birthHeight / p.cardHeight) *
      Math.pow(p.exitHeight / p.birthHeight, u);
    const z = p.perspective * (1 - 1 / scale);
    const rail =
      p.railExit - (p.railExit - p.railBirth) * Math.pow(1 - u, p.fan);
    const turn = p.turnBirth + (p.turnExit - p.turnBirth) * u;
    steps.push(
      `${(rawU * 100).toFixed(2)}%{transform:translate3d(${(dir * rail).toFixed(
        2,
      )}cqw,0,${z.toFixed(2)}cqw) rotateY(${(-dir * turn).toFixed(2)}deg)}`,
    );
  }
  return `@keyframes ${name}{${steps.join("")}}`;
}

export type StreamImage = {
  src: string;
  alt?: string;
  badge?: string;
  tagline?: string;
};

export type ImageStreamHeroProps = {
  /**
   * Images cycled onto the rails. Both rails run the same sequence, so the
   * corridor reads as one mirrored stream. Fewer than `cards` simply repeat.
   */
  images: StreamImage[];
  /**
   * Cards on each rail at once. More cards means a denser corridor, not a
   * faster one — spacing is derived from this and `speed`.
   * @default 9
   */
  cards?: number;
  /**
   * Seconds for one card to travel the whole corridor.
   * @default 18
   */
  speed?: number;
  /**
   * Vertical placement of the corridor's axis, as a percentage of height.
   * @default 55
   */
  axis?: number;
  /** Override any part of the corridor geometry. Merged over the defaults. */
  path?: CorridorPath;
  /** Play or pause animation */
  isPlaying?: boolean;
  /** Reverse flow direction */
  reverse?: boolean;
  /** Optional click handler for a card */
  onCardClick?: (img: StreamImage, index: number) => void;
  /** Content rendered above the corridor. */
  children?: React.ReactNode;
  className?: string;
  cardClassName?: string;
};

export function ImageStreamHero({
  images,
  cards = 9,
  speed = 18,
  axis = 55,
  path,
  isPlaying = true,
  reverse = false,
  onCardClick,
  children,
  className,
  cardClassName,
  ...props
}: React.ComponentProps<"div"> & ImageStreamHeroProps) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const right = `ish-r-${id}`;
  const left = `ish-l-${id}`;
  const card = `ish-c-${id}`;

  const p = React.useMemo(() => ({ ...DEFAULT_CORRIDOR_PATH, ...path }), [path]);

  const css = React.useMemo(
    () =>
      `${generateCorridorKeyframes(1, right, p, reverse)}${generateCorridorKeyframes(-1, left, p, reverse)}` +
      `@media(prefers-reduced-motion:reduce){.${card}{animation-play-state:paused}}`,
    [right, left, card, p, reverse],
  );

  const [failedImages, setFailedImages] = React.useState<Record<string, boolean>>({});

  return (
    <div
      className={cn("relative overflow-hidden select-none", className)}
      {...props}
      style={{ containerType: "inline-size", ...props.style }}
    >
      <style>{css}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          perspective: `${p.perspective}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {[right, left].map((name) =>
            Array.from({ length: cards }, (_, i) => {
              const img = images[i % Math.max(images.length, 1)];
              const isFailed = img?.src ? failedImages[img.src] : true;

              return (
                <div
                  key={`${name}-${i}`}
                  onClick={onCardClick && img ? () => onCardClick(img, i) : undefined}
                  className={cn(
                    card,
                    "absolute overflow-hidden shadow-2xl transition-all duration-300 group",
                    onCardClick ? "pointer-events-auto cursor-pointer" : "pointer-events-none",
                    cardClassName
                  )}
                  style={{
                    left: "50%",
                    top: `${axis}%`,
                    width: `${p.cardWidth}cqw`,
                    height: `${p.cardHeight}cqw`,
                    marginLeft: `${-p.cardWidth / 2}cqw`,
                    marginTop: `${-p.cardHeight / 2}cqw`,
                    borderRadius: `${p.cardRadius}cqw`,
                    animation: `${name} ${speed}s linear infinite`,
                    animationPlayState: isPlaying ? "running" : "paused",
                    // Negative delay drops each card mid-flight, so the
                    // corridor is already full on the first frame.
                    animationDelay: `${-(i * speed) / cards}s`,
                    backfaceVisibility: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    background: "rgba(22, 21, 24, 0.95)",
                  }}
                >
                  {img?.src && !isFailed ? (
                    <img
                      src={img.src}
                      alt={img.alt ?? ""}
                      loading="lazy"
                      decoding="async"
                      onError={() => {
                        if (img?.src) {
                          setFailedImages((prev) => ({ ...prev, [img.src]: true }));
                        }
                      }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col justify-between p-3 bg-gradient-to-br from-neutral-800 via-neutral-900 to-stone-900 text-left border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono tracking-wider text-[#8B3A2A] font-bold uppercase">
                          IP3 // 0{i + 1}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A2A]" />
                      </div>
                      <div>
                        <p className="text-[11px] font-serif text-white/90 font-medium leading-snug line-clamp-2">
                          {img?.alt || `System Node 0${i + 1}`}
                        </p>
                        <span className="text-[9px] font-mono text-neutral-400 mt-1 block">
                          Translational Architecture
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Gradient overlay on image with index and caption */}
                  {img?.src && !isFailed && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-left pointer-events-none">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[8px] font-mono font-bold tracking-wider px-1 py-0.5 rounded bg-black/60 border border-white/15 text-stone-300">
                          0{ (i % cards) + 1 }
                        </span>
                        {img.badge && (
                          <span className="text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#8B3A2A]/80 border border-[#8B3A2A] text-white uppercase">
                            {img.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] font-medium text-white/95 leading-tight truncate drop-shadow-sm">
                        {img.alt || "System Perspective"}
                      </p>
                      {img.tagline && (
                        <span className="text-[8.5px] font-mono text-[#D5C8BC] truncate block mt-0.5 opacity-90">
                          {img.tagline}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

export default ImageStreamHero;
