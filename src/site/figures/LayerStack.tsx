import { useFocus, type FocusGroup } from '../../lib/storyStore';

interface LayerStackProps {
  items: readonly { id: string; name: string }[];
  group: FocusGroup;
  /** Indexes of layers that relate to the focused one (systems only). */
  relatedOf?: (index: number) => number[];
  caption: string;
}

/**
 * Static stand-in for the 3D layers: stacked planes seen from above and to one side.
 * Shown when the 3D scene is off, so every scene still has its picture.
 */
export function LayerStack({ items, group, relatedOf, caption }: LayerStackProps) {
  const focus = useFocus();
  const active = focus && focus.group === group ? focus.index : null;
  const related = active !== null && relatedOf ? relatedOf(active) : [];

  const W = 420;
  const cx = 210;
  const half = 130;
  const rise = 40;
  const gap = items.length > 5 ? 46 : 54;
  const H = 40 + gap * (items.length - 1) + rise * 2 + 24;

  return (
    <figure className="mt-8 lg:mt-10" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[26rem]" fill="none">
        {[...items].reverse().map((item, ri) => {
          const i = items.length - 1 - ri;
          const cy = 28 + rise + gap * i;
          const isActive = active === i;
          const isRelated = related.includes(i);
          const stroke = isActive ? '#F2EFE5' : isRelated ? '#35D6CF' : '#35D6CF';
          const strokeOpacity = isActive ? 1 : isRelated ? 0.95 : 0.5;
          return (
            <g key={item.id}>
              <path
                d={`M${cx - half} ${cy} L${cx} ${cy - rise} L${cx + half} ${cy} L${cx} ${cy + rise} Z`}
                fill="#0A1628"
                fillOpacity="0.92"
                stroke={stroke}
                strokeOpacity={strokeOpacity}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <path
                d={`M${cx - half + 36} ${cy} L${cx} ${cy - rise + 14} L${cx + half - 36} ${cy} L${cx} ${cy + rise - 14} Z`}
                fill="#35D6CF"
                fillOpacity={isActive ? 0.22 : 0.07}
              />
              <text
                x={cx}
                y={cy + 22}
                textAnchor="middle"
                fontSize="14"
                fontWeight="600"
                fontFamily="var(--font-sans)"
                fill={isActive ? '#F2EFE5' : '#A9B8CC'}
              >
                {item.name}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}
