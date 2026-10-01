import { useInViewOnce } from '../../lib/useInViewOnce';

/**
 * Concept diagram: difference-in-differences.
 * The numbers are an illustrative scale, not data; the figure says so.
 */
export function ImpactChart() {
  const { ref, armed, seen } = useInViewOnce<HTMLElement>();

  const X0 = 72;
  const X1 = 440;
  const baseX = 104;
  const startX = 226;
  const endX = 374;
  const yFor = (v: number) => 252 - v * 2.2;

  const comparison = [
    [baseX, 48],
    [startX, 54],
    [endX, 60],
  ] as const;
  const supported = [
    [baseX, 36],
    [startX, 42],
    [endX, 70],
  ] as const;

  const pts = (arr: readonly (readonly [number, number])[]) => arr.map(([x, v]) => `${x},${yFor(v)}`).join(' ');
  const counterfactualEnd = 48;
  const font = 'var(--font-sans)';

  return (
    <figure ref={ref} className="chart m-0" data-armed={armed} data-in={seen} aria-labelledby="chart-impact-title">
      <h3 id="chart-impact-title" className="t-h3 text-ivory">
        Did it work?
      </h3>
      <svg
        viewBox="0 0 480 320"
        role="img"
        aria-label="Line chart. Before the programme starts, a supported group and a comparison group move in parallel. After it starts, the supported group rises faster. The gap between its actual result and a dashed line showing where it would have been without the programme is the estimated impact."
        className="mt-4 w-full"
      >
        {/* axes */}
        <line x1={X0} y1="252" x2={X1} y2="252" stroke="#A9B8CC" strokeOpacity="0.7" />
        <line x1={X0} y1="24" x2={X0} y2="252" stroke="#A9B8CC" strokeOpacity="0.7" />
        <text x="22" y="138" transform="rotate(-90 22 138)" textAnchor="middle" fill="#A9B8CC" fontSize="14" fontFamily={font}>
          Outcome indicator (illustrative scale)
        </text>

        {/* programme start */}
        <line x1={startX} y1="40" x2={startX} y2="252" stroke="#F2EFE5" strokeOpacity="0.55" strokeDasharray="4 5" />
        <text x={startX} y="30" textAnchor="middle" fill="#F2EFE5" fontSize="14" fontWeight="600" fontFamily={font}>
          Programme starts
        </text>

        {/* x ticks */}
        {(
          [
            [baseX, 'Baseline'],
            [endX, 'Endline'],
          ] as const
        ).map(([x, label]) => (
          <g key={label}>
            <line x1={x} y1="252" x2={x} y2="258" stroke="#A9B8CC" />
            <text x={x} y="278" textAnchor="middle" fill="#A9B8CC" fontSize="14" fontFamily={font}>
              {label}
            </text>
          </g>
        ))}
        <text x={(X0 + X1) / 2} y="304" textAnchor="middle" fill="#A9B8CC" fontSize="14" fontFamily={font}>
          Time
        </text>

        {/* counterfactual: where the supported group would have been without the programme */}
        <polyline
          className="draw"
          pathLength={1}
          points={`${startX},${yFor(42)} ${endX},${yFor(counterfactualEnd)}`}
          fill="none"
          stroke="#35D6CF"
          strokeOpacity="0.75"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        <polyline className="draw" pathLength={1} points={pts(comparison)} fill="none" stroke="#A9B8CC" strokeWidth="2.5" strokeLinejoin="round" />
        <polyline className="draw" pathLength={1} points={pts(supported)} fill="none" stroke="#35D6CF" strokeWidth="3.5" strokeLinejoin="round" />

        {comparison.map(([x, v], i) => (
          <circle key={`c${i}`} cx={x} cy={yFor(v)} r="3.5" fill="#0A1628" stroke="#A9B8CC" strokeWidth="2" />
        ))}
        {supported.map(([x, v], i) => (
          <circle key={`s${i}`} cx={x} cy={yFor(v)} r="4" fill="#0A1628" stroke="#35D6CF" strokeWidth="2.5" />
        ))}

        {/* series labels sit clear of the lines */}
        <text x={baseX - 10} y={yFor(48) - 24} fill="#A9B8CC" fontSize="14" fontWeight="600" fontFamily={font}>
          Comparison group
        </text>
        <text x={baseX - 10} y={yFor(36) + 30} fill="#35D6CF" fontSize="14" fontWeight="600" fontFamily={font}>
          Supported group
        </text>

        <g className="fade-in">
          <text x={endX} y={yFor(counterfactualEnd) + 26} textAnchor="end" fill="#35D6CF" fontSize="13" fontFamily={font}>
            <tspan x={endX} dy="0">
              Without the
            </tspan>
            <tspan x={endX} dy="15">
              programme
            </tspan>
            <tspan x={endX} dy="15">
              (estimate)
            </tspan>
          </text>
          <path d={`M${endX + 14} ${yFor(counterfactualEnd)} h7 V${yFor(70)} h-7`} fill="none" stroke="#E3A94B" strokeWidth="2.5" />
          <text x={endX + 30} y={(yFor(70) + yFor(counterfactualEnd)) / 2 - 2} fill="#E3A94B" fontSize="14" fontWeight="600" fontFamily={font}>
            <tspan x={endX + 30} dy="0">
              Estimated
            </tspan>
            <tspan x={endX + 30} dy="16">
              impact
            </tspan>
          </text>
        </g>
      </svg>
      <figcaption className="t-ui mt-3 max-w-[34rem] text-mist">
        We compare change in the supported group with change in a similar group that was not supported. The gap beyond the dashed line
        is the estimated effect of the programme.
        <span className="mt-2 block text-ivory/80">Illustrative example of the method, not project data.</span>
      </figcaption>
    </figure>
  );
}
