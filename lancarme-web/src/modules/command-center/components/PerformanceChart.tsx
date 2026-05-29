import { SectionHeader } from '@/components/shared/SectionHeader';
import { performanceData } from '../data/mockData';

export function PerformanceChart() {
  const { points, period } = performanceData;
  const width = 400;
  const height = 120;
  const padding = { top: 10, right: 10, bottom: 20, left: 30 };

  const maxVal = Math.max(...points);
  const minVal = Math.min(...points);
  const range = maxVal - minVal || 1;

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const xs = points.map((_, i) => padding.left + (i / (points.length - 1)) * innerWidth);
  const ys = points.map((v) => padding.top + innerHeight - ((v - minVal) / range) * innerHeight);

  const linePath = xs
    .map((x, i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${ys[i].toFixed(1)}`)
    .join(' ');

  const areaPath =
    `M ${xs[0].toFixed(1)} ${(height - padding.bottom).toFixed(1)} ` +
    xs.map((x, i) => `L ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ') +
    ` L ${xs[xs.length - 1].toFixed(1)} ${(height - padding.bottom).toFixed(1)} Z`;

  const yLabels = [minVal, Math.round(minVal + range / 2), maxVal];

  return (
    <div className="bg-surface-card rounded-lg border border-border shadow-sm p-4 mb-4">
      <SectionHeader
        title="Desempenho Geral"
        action={
          <span className="text-xs bg-brand-surface text-brand rounded-full px-2 py-0.5 font-medium">
            {period}
          </span>
        }
      />
      <p className="sr-only">
        Gráfico de desempenho demonstrativo dos últimos {period}. Os valores são fictícios e servem apenas para ilustrar a tendência.
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        aria-hidden="true"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y axis labels */}
        {yLabels.map((val, i) => {
          const y = padding.top + innerHeight - (i / (yLabels.length - 1)) * innerHeight;
          return (
            <text
              key={i}
              x={padding.left - 5}
              y={y + 4}
              textAnchor="end"
              fontSize="9"
              fill="#94a3b8"
            >
              {val}
            </text>
          );
        })}

        {/* Grid lines */}
        {yLabels.map((_, i) => {
          const y = padding.top + innerHeight - (i / (yLabels.length - 1)) * innerHeight;
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={padding.left + innerWidth}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Last point highlight */}
        <circle
          cx={xs[xs.length - 1]}
          cy={ys[ys.length - 1]}
          r="4"
          fill="#3b82f6"
          stroke="white"
          strokeWidth="2"
        />
      </svg>
      <p className="text-xs text-ink-muted mt-1">Desempenho geral (demonstrativo)</p>
    </div>
  );
}
