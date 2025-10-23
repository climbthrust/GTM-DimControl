import React, { useMemo } from 'react';

export default function MeasurementScaleSVG({
  nominal,
  tolPlus,
  tolMinus,
  value,
  state = 'neutral',
}) {
  // === Konstanten aus Vorlage (Proportionen beibehalten) ===
  const width = 420;
  const height = 100;
  const bandHeight = 32;
  const paddingX = 28;
  const topPad = 8;
  const bottomPad = 16;
  const barWidth = 6;

  // === Farben exakt aus der Vorlage ===
  const colors = {
    bg: '#1b1b1b', // Hintergrund
    band: '#2a2a2a', // Toleranzband
    lineTol: '#737373', // Rot für Tol− / Tol+
    lineNominal: '#ffc027', // Gelb
    white: '#ffffff',
    textGray: '#737373',
    textYellow: '#ffc027',
  };

  // === Skalierung berechnen ===
  const leftValue = nominal - tolMinus;
  const rightValue = nominal + tolPlus;
  const spanValue = Math.max(1e-9, rightValue - leftValue);
  const tolMinusX = paddingX;
  const tolPlusX = width - paddingX;
  const tolSpanPx = tolPlusX - tolMinusX;

  // Nominal-Position (relativ)
  const nominalX = tolMinusX + ((nominal - leftValue) / spanValue) * tolSpanPx;

  // === Weißer Balken (current value) ===
  const { indicatorX } = useMemo(() => {
    if (value === '' || isNaN(Number(value))) {
      return { indicatorX: nominalX };
    }
    const v = Number(value);
    let x = tolMinusX + ((v - leftValue) / spanValue) * tolSpanPx;
    const overshoot = 10;
    if (x < tolMinusX - overshoot) x = tolMinusX - overshoot;
    if (x > tolPlusX + overshoot) x = tolPlusX + overshoot;
    return { indicatorX: x };
  }, [value, leftValue, rightValue, tolMinusX, tolPlusX, tolSpanPx, nominalX]);

  // === Farbfilter je nach Zustand (leicht variiert) ===
  const overlay =
    state === 'fail'
      ? 'rgba(229,57,53,0.2)' // leicht rötlicher Schleier
      : state === 'ok'
      ? 'rgba(255,192,39,0.15)' // leicht gelblicher Schleier
      : 'transparent';

  // === Formatierung ===
  const fmt = n => Number(n).toFixed(2);

  return (
    <svg width={width} height={height} className='select-none'>
      {/* Hintergrund */}
      <rect x='0' y='0' width={width} height={height} fill={colors.bg} rx='6' />

      {/* Overlay für Zustand */}
      {overlay !== 'transparent' && (
        <rect x='0' y='0' width={width} height={height} fill={overlay} rx='6' />
      )}

      {/* Toleranzband */}
      <rect
        x={tolMinusX}
        y={(height - bandHeight) / 2}
        width={tolSpanPx}
        height={bandHeight}
        fill={colors.band}
        rx='4'
      />

      {/* Linien */}
      <line
        x1={tolMinusX}
        y1={topPad + 12}
        x2={tolMinusX}
        y2={height - bottomPad - 12}
        stroke={colors.lineTol}
        strokeWidth='2'
      />
      <line
        x1={nominalX}
        y1={topPad}
        x2={nominalX}
        y2={height - bottomPad}
        stroke={colors.lineNominal}
        strokeWidth='2'
      />
      <line
        x1={tolPlusX}
        y1={topPad + 12}
        x2={tolPlusX}
        y2={height - bottomPad - 12}
        stroke={colors.lineTol}
        strokeWidth='2'
      />

      {/* Weißer Messbalken */}
      <rect
        x={indicatorX - barWidth / 2}
        y={topPad}
        width={barWidth}
        height={height - topPad - bottomPad}
        fill={colors.white}
        rx='2'
      />

      {/* Zahlen unten */}
      <text
        x={tolMinusX}
        y={height - 10}
        textAnchor='middle'
        fontSize='14'
        fill={colors.textGray}
      >
        {fmt(leftValue)}
      </text>
      <text
        x={nominalX}
        y={height - 10}
        textAnchor='middle'
        fontSize='14'
        fill={colors.textGray}
      >
        {fmt(nominal)}
      </text>
      <text
        x={tolPlusX}
        y={height - 10}
        textAnchor='middle'
        fontSize='14'
        fill={colors.textGray}
      >
        {fmt(rightValue)}
      </text>
    </svg>
  );
}
