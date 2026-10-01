import { useInViewOnce } from '../../lib/useInViewOnce';

/**
 * Concept diagram: cost-benefit over time.
 * Values are an illustrative scale chosen to show the shape of a typical analysis, not data.
 */
const costs = [-40, -25, -8, -5, -5, -5, -5, -5];
const benefits = [0, 6, 18, 28, 34, 38, 40, 40];

export function CostBenefitChart() {
  const { ref, armed, seen } = useInViewOnce<HTMLElement>();

  const cumulative: number[] = [];
  costs.forEach((c, i) => cumulative.push((cumulative[i - 1] ?? 0) + c + benefits[i]!));

  const X0 = 72;
  const X1 = 420;
  const n = costs.length;
  const slot = (X1 - X0) / n;
  const barW = slot * 0.5;
  const top = 44;
  const bottom = 250;
  const vMax = 110;
  const vMin = -64;
  const yFor = (v: number) => top + ((vMax - v) / (vMax - vMin)) * (bottom - top);
  const xCentre = (i: number) => X0 + slot * (i + 0.5);

  // Linear crossing of zero by the cumulative line.
  let crossX = xCentre(n - 1);
  for (let i = 1; i < n; i++) {
    const a = cumulative[i - 1]!;
    const b = cumulative[i]!;
    if (a < 0 && b >= 0) {
      crossX = xCentre(i - 1) + ((0 - a) / (b - a)) * slot;
      break;
    }
  }

  const linePts = cumulative.map((v, i) => `${xCentre(i)},${yFor(v)}`).join(' ');

  return (
    <figure ref={ref} className="chart m-0" data-armed={armed} data-in={seen} aria-labelledby="chart-cba-title">
      <h3 id="chart-cba-title" className="t-h3 text-ivory">
        Is it worth it?
      </h3>
      <svg
        viewBox="0 0 440 320"
        role="img"
        aria-label="Bar and line chart. Costs fall mostly in the early years and benefits build over time. The cumulative net benefit line starts below zero and crosses zero at the break-even point, after which the investment has paid back."
        className="mt-4 w-full"
      >
        {/* legend */}
        <g fontSize="13" fontFamily="var(--font-sans)" fontWeight="600">
          <rect x={X0} y="10" width="12" height="12" fill="#A9B8CC" />
          <text x={X0 + 18} y="21" fill="#A9B8CC">
            Costs
          </text>
          <rect x={X0 + 74} y="10" width="12" height="12" fill="#E3A94B" />
          <text x={X0 + 92} y="21" fill="#E3A94B">
            Benefits
          </text>
          <line x1={X0 + 168} y1="16" x2={X0 + 190} y2="16" stroke="#35D6CF" strokeWidth="3.5" />
          <text x={X0 + 196} y="21" fill="#35D6CF">
            Cumulative net benefit
          </text>
        </g>

        {/* axes */}
        <line x1={X0} y1={top} x2={X0} y2={bottom} stroke="#A9B8CC" strokeOpacity="0.7" />
        <line x1={X0} y1={yFor(0)} x2={X1} y2={yFor(0)} stroke="#A9B8CC" strokeOpacity="0.8" />
        <text x={X0 - 8} y={yFor(0) + 5} textAnchor="end" fill="#A9B8CC" fontSize="14" fontFamily="var(--font-sans)">
          0
        </text>
        <text
          x="22"
          y="150"
          transform="rotate(-90 22 150)"
          textAnchor="middle"
          fill="#A9B8CC"
          fontSize="14"
          fontFamily="var(--font-sans)"
        >
          Value (illustrative units)
        </text>
        <text x={X0 + 4} y="290" fill="#A9B8CC" fontSize="14" fontFamily="var(--font-sans)">
          Start
        </text>
        <text x={X1} y="290" textAnchor="end" fill="#A9B8CC" fontSize="14" fontFamily="var(--font-sans)">
          Later years
        </text>
        <text x={(X0 + X1) / 2} y="310" textAnchor="middle" fill="#A9B8CC" fontSize="14" fontFamily="var(--font-sans)">
          Time since the project starts
        </text>

        {/* bars */}
        {costs.map((c, i) => (
          <rect key={`c${i}`} x={xCentre(i) - barW / 2} y={yFor(0)} width={barW} height={yFor(c) - yFor(0)} fill="#A9B8CC" fillOpacity="0.9" />
        ))}
        {benefits.map((b, i) =>
          b > 0 ? (
            <rect key={`b${i}`} x={xCentre(i) - barW / 2} y={yFor(b)} width={barW} height={yFor(0) - yFor(b)} fill="#E3A94B" fillOpacity="0.92" />
          ) : null,
        )}

        {/* cumulative line */}
        <polyline className="draw" pathLength={1} points={linePts} fill="none" stroke="#35D6CF" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
        {cumulative.map((v, i) => (
          <circle key={`p${i}`} cx={xCentre(i)} cy={yFor(v)} r="3.5" fill="#0A1628" stroke="#35D6CF" strokeWidth="2.5" />
        ))}

        {/* break-even */}
        <g className="fade-in">
          <line x1={crossX} y1={yFor(0)} x2={crossX} y2="62" stroke="#F2EFE5" strokeOpacity="0.7" strokeDasharray="4 5" />
          <circle cx={crossX} cy={yFor(0)} r="5.5" fill="#F2EFE5" />
          <text x={crossX - 8} y="64" textAnchor="end" fill="#F2EFE5" fontSize="14" fontWeight="600" fontFamily="var(--font-sans)">
            Break-even
          </text>
        </g>
      </svg>
      <figcaption className="t-ui mt-3 max-w-[34rem] text-mist">
        Costs come early and benefits build over time. The point where cumulative net benefit turns positive shows when the investment
        pays back. A full analysis also discounts future values and tests how the result changes under different assumptions.
        <span className="mt-2 block text-ivory/80">Illustrative example of the method, not project data.</span>
      </figcaption>
    </figure>
  );
}
