import { sectorEdges } from '../../content/defaults/sectors';
import type { Sector } from '../../content/types';

/** Short labels that fit around the ring. New sectors added in the CMS fall back to their first two words. */
const SHORT: Record<string, string> = {
  'macroeconomic-fiscal': 'Macro and fiscal',
  'education-skills': 'Education',
  'climate-energy': 'Climate and energy',
  'private-sector': 'Private sector',
  'cities-municipal-finance': 'Cities',
  'social-protection': 'Social',
  'public-governance': 'Governance',
  'monitoring-evaluation': 'Evaluation',
};
const short = (s: Sector) => SHORT[s.slug] ?? s.name.split(/\s+/).slice(0, 2).join(' ');

const CX = 250;
const CY = 232;
const R = 128;
const CENTRE = 'monitoring-evaluation';

interface Props {
  sectors: Sector[];
  selected: string | null;
  onSelect?: (slug: string) => void;
}

/**
 * The eight sectors as one system. Monitoring, evaluation and learning sits in the centre because it
 * touches every other sector. Decorative: the list beside it is the accessible interface.
 */
export function SectorMap({ sectors, selected, onSelect }: Props) {
  const ring = sectors.filter((s) => s.slug !== CENTRE);
  const sel = selected ? sectors.find((s) => s.slug === selected) ?? null : null;
  const linked = new Set<string>(sel ? sel.connects : []);

  const nodePos = (i: number) => {
    const a = (-90 + (i * 360) / ring.length) * (Math.PI / 180);
    return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a), cos: Math.cos(a), sin: Math.sin(a) };
  };
  const pos = new Map<string, { x: number; y: number }>();
  ring.forEach((s, i) => pos.set(s.slug, nodePos(i)));
  pos.set(CENTRE, { x: CX, y: CY });

  return (
    <svg viewBox="0 0 580 470" className="gs-draw mx-auto w-full max-w-[34rem]" aria-hidden="true" focusable="false">
      {sectorEdges(sectors).map(([a, b]) => {
        const pa = pos.get(a);
        const pb = pos.get(b);
        if (!pa || !pb) return null;
        const on = sel && (sel.slug === a || sel.slug === b);
        return (
          <line
            key={`${a}-${b}`}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke={on ? '#086569' : '#0A1628'}
            strokeOpacity={on ? 1 : 0.16}
            strokeWidth={on ? 2.5 : 1.2}
            style={{ transition: 'stroke-opacity .25s, stroke-width .25s' }}
          />
        );
      })}

      {sectors.map((s) => {
        const p = pos.get(s.slug);
        if (!p) return null;
        const isSel = selected === s.slug;
        const isLinked = linked.has(s.slug);
        const isCentre = s.slug === CENTRE;
        const r = isCentre ? 46 : 24;
        const idx = ring.findIndex((x) => x.slug === s.slug);
        const n = idx >= 0 ? nodePos(idx) : null;

        let label: { x: number; y: number; anchor: 'start' | 'end' | 'middle' } | null = null;
        if (n) {
          if (Math.abs(n.cos) < 0.35) label = { x: p.x, y: n.sin < 0 ? p.y - r - 12 : p.y + r + 22, anchor: 'middle' };
          else if (n.cos > 0) label = { x: p.x + r + 10, y: p.y + 5, anchor: 'start' };
          else label = { x: p.x - r - 10, y: p.y + 5, anchor: 'end' };
        }

        return (
          <g key={s.slug} onClick={onSelect ? () => onSelect(s.slug) : undefined} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
            <circle
              cx={p.x}
              cy={p.y}
              r={r}
              fill={isSel ? '#0A1628' : '#F2EFE5'}
              stroke={isSel ? '#0A1628' : isLinked ? '#086569' : '#0A1628'}
              strokeWidth={isSel || isLinked ? 3 : 1.5}
              strokeOpacity={isSel || isLinked ? 1 : 0.5}
              style={{ transition: 'fill .25s, stroke .25s' }}
            />
            {isCentre ? (
              <text textAnchor="middle" fontSize="14" fontWeight="600" fontFamily="var(--font-sans)" fill={isSel ? '#F2EFE5' : '#0A1628'}>
                <tspan x={p.x} y={p.y - 3}>
                  Evaluation
                </tspan>
                <tspan x={p.x} y={p.y + 15}>
                  and learning
                </tspan>
              </text>
            ) : (
              <circle cx={p.x} cy={p.y} r="5" fill={isSel ? '#35D6CF' : '#086569'} fillOpacity={isSel || isLinked ? 1 : 0.55} />
            )}
            {label ? (
              <text
                x={label.x}
                y={label.y}
                textAnchor={label.anchor}
                fontSize="16"
                fontWeight={isSel ? 700 : 600}
                fontFamily="var(--font-sans)"
                fill="#0A1628"
                fillOpacity={isSel || isLinked ? 1 : 0.72}
              >
                {short(s)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
