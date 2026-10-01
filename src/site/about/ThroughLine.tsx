interface Station {
  label: string;
  text: string;
}

const W = 1000;
const H = 180;
const MID = H / 2;

/** Deterministic strand shapes: [amplitude, cycles across the width, phase]. */
const LOOSE: readonly (readonly [number, number, number])[] = [
  [66, 2.6, 0.4],
  [58, 3.4, 2.1],
  [74, 1.9, 4.0],
  [48, 4.2, 5.3],
  [62, 3.0, 3.3],
  [40, 5.1, 1.2],
];
const MAIN: readonly [number, number, number] = [44, 2.2, 0];

/** 1 where the strands are tangled, easing to 0 where they have become one line. */
function tangle(t: number): number {
  const from = 0.04;
  const to = 0.6;
  if (t <= from) return 1;
  if (t >= to) return 0;
  return 0.5 + 0.5 * Math.cos((Math.PI * (t - from)) / (to - from));
}

function strand([amp, cycles, phase]: readonly [number, number, number]): string {
  let d = '';
  for (let x = 0; x <= W; x += 6) {
    const t = x / W;
    const y = MID + tangle(t) * amp * Math.sin(cycles * Math.PI * 2 * t + phase);
    d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)} `;
  }
  return d.trim();
}

const LOOSE_PATHS = LOOSE.map(strand);
const MAIN_PATH = strand(MAIN);

/**
 * The through-line as one drawn line. Several strands start tangled (complexity), settle into a single
 * line as the work is understood and designed, and carry on past the last station (impact).
 * The drawing is decorative: the stations are an ordered list, so the sequence is read out in order.
 */
export function ThroughLine({ items, label }: { items: Station[]; label: string }) {
  const n = items.length;
  if (n === 0) return null;
  const lastStart = ((n - 1) / n) * W;

  return (
    <div className="mt-12 lg:mt-16">
      <div aria-hidden="true" className="relative mx-[7px] h-28 lg:h-auto lg:aspect-[1000/180]">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
          {LOOSE_PATHS.map((d, i) => (
            <path key={i} d={d} stroke="var(--color-mist)" strokeOpacity="0.45" strokeWidth="1.25" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          ))}
          <path d={MAIN_PATH} stroke="var(--color-signal)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          <path d={`M${lastStart} ${MID} L${W} ${MID}`} stroke="var(--color-amber)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        </svg>
        {items.map((it, i) => {
          const last = i === n - 1;
          return (
            <span
              key={it.label}
              className={`absolute hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 lg:block ${
                last ? 'border-amber bg-amber' : 'border-signal bg-midnight'
              }`}
              style={{ left: `${(i / n) * 100}%`, top: `${(MID / H) * 100}%` }}
            />
          );
        })}
      </div>

      <ol
        role="list"
        aria-label={label}
        className="mt-8 lg:mt-8 lg:grid lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
        style={{ ['--n' as string]: n }}
      >
        {items.map((it, i) => {
          const last = i === n - 1;
          return (
            <li
              key={it.label}
              className={`relative border-l pb-8 pl-8 last:pb-0 lg:border-l-0 lg:pb-0 lg:pl-0 lg:pr-6 ${last ? 'border-l-transparent' : 'border-midnight-rule'}`}
            >
              <span
                aria-hidden="true"
                className={`absolute -left-[8px] top-1.5 block h-3.5 w-3.5 rounded-full border-2 lg:hidden ${
                  last ? 'border-amber bg-amber' : 'border-signal bg-midnight'
                }`}
              />
              <h3 className={`t-h3 ${last ? 'text-amber' : 'text-ivory'}`}>{it.label}</h3>
              <p className="t-ui mt-2 text-mist">{it.text}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
