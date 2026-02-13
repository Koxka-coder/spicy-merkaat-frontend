/**
 * Sparkline — gráfico SVG inline para historial de humedad.
 * Sin dependencias externas: polyline + área rellena con gradiente.
 *
 * Props:
 *   points:  [{time, value}, ...]  — datos de moisture_pct
 *   width:   número (default 210)
 *   height:  número (default 44)
 *   color:   string (default '#4caf50')
 *   gradId:  string — id único para el gradiente (evita colisión si hay varios)
 */
const Sparkline = ({ points = [], width = 210, height = 44, color = '#4caf50', gradId = 'sg' }) => {
  if (!points.length) {
    return (
      <svg width={width} height={height} style={{ display: 'block' }}>
        <text
          x={width / 2} y={height / 2}
          textAnchor="middle" fontSize="9" fill="#bbb"
          dominantBaseline="middle"
        >
          Sin datos
        </text>
      </svg>
    );
  }

  const values = points.map(p => p.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range  = maxVal - minVal || 1;

  const pad = 4;
  const toX = (i) => pad + (i / (points.length - 1 || 1)) * (width  - pad * 2);
  const toY = (v) => height - pad - ((v - minVal) / range) * (height - pad * 2);

  const linePoints = points
    .map((p, i) => `${toX(i).toFixed(1)},${toY(p.value).toFixed(1)}`)
    .join(' ');

  const firstX  = toX(0).toFixed(1);
  const lastX   = toX(points.length - 1).toFixed(1);
  const bottomY = (height - pad).toFixed(1);
  const areaPoints = `${firstX},${bottomY} ${linePoints} ${lastX},${bottomY}`;

  const lastVal = values[values.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0"  />
        </linearGradient>
      </defs>

      {/* Área rellena */}
      <polygon points={areaPoints} fill={`url(#${gradId})`} />

      {/* Línea principal */}
      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Dot en el último punto */}
      <circle
        cx={toX(points.length - 1)}
        cy={toY(lastVal)}
        r="2.5"
        fill={color}
      />

      {/* Labels min / max */}
      <text x={pad} y={height - 1} fontSize="7" fill="#aaa">
        {minVal.toFixed(0)}%
      </text>
      <text x={width - pad} y={height - 1} fontSize="7" fill="#aaa" textAnchor="end">
        {maxVal.toFixed(0)}%
      </text>
    </svg>
  );
};

export default Sparkline;
