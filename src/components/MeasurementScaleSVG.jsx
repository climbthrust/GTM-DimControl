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
  const bandHeight = 28;
  const marginOfLines = 5;
  const bandTop = 35;
  const paddingX = 28;
  const linesTopTop = 16;
  const linesTopBottom = bandTop - marginOfLines;
  const linesBottomTop = bandTop + bandHeight + marginOfLines;
  const linesBottomBottom = height - 26;
  const topPad = 16;
  const bottomPad = 24;
  const barWidth = 6;

  // === Farben exakt aus der Vorlage ===
  const colors = {
    gray100: '#f5f5f5',
    gray500: '#737373',
    gray600: '#525252',
    gray800: '#2e2e2e', // Hintergrund,
    gray700: '#404040',
    fail700: '#922222',
    fail800: '#6f1818',
    accent500: '#ffc027',
    green700: '#126012',
    green800: '#0C460C',
    green900: '#072c07',
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

  // === Formatierung ===
  const fmt = n => Number(n).toFixed(2);

  return (
    <svg width={width} height={height} className='select-none'>
      {/* Hintergrund */}
      <rect
        x='0'
        y='0'
        width={width}
        height={height}
        fill={colors.gray800}
        rx='6'
      />

      {/* Toleranzband */}
      <rect
        x={tolMinusX}
        // y={(height - bandHeight) / 2}
        y={bandTop}
        width={tolSpanPx}
        height={bandHeight}
        fill={
          state === 'fail'
            ? colors.fail800
            : state === 'ok'
            ? colors.green900
            : colors.gray700
        }
        stroke={
          state === 'fail'
            ? colors.fail700
            : state === 'ok'
            ? colors.green800
            : colors.gray600
        }
        strokeWidth={3}
      />

      {/* Tolerance Minus Bar */}
      <line
        x1={tolMinusX}
        y1={linesTopTop}
        x2={tolMinusX}
        y2={linesTopBottom}
        stroke={colors.gray600}
        strokeWidth='1'
      />
      <line
        x1={tolMinusX}
        y1={linesBottomTop}
        x2={tolMinusX}
        y2={linesBottomBottom}
        stroke={colors.gray600}
        strokeWidth='1'
      />

      {/* Tolerance Plus Bar */}

      <line
        x1={tolPlusX}
        y1={linesTopTop}
        x2={tolPlusX}
        y2={linesTopBottom}
        stroke={colors.gray600}
        strokeWidth='1'
      />
      <line
        x1={tolPlusX}
        y1={linesBottomTop}
        x2={tolPlusX}
        y2={linesBottomBottom}
        stroke={colors.gray600}
        strokeWidth='1'
      />

      {/* Messbalken */}
      {!(state == 'neutral') && (
        <rect
          x={indicatorX - barWidth / 2}
          y={bandTop - marginOfLines}
          width={barWidth}
          height={bandHeight + 2 * marginOfLines}
          fill={colors.gray100}
        />
      )}

      {/* Nominal Bar */}
      <line
        x1={nominalX}
        y1={linesTopBottom - marginOfLines}
        x2={nominalX}
        y2={linesBottomTop + marginOfLines}
        stroke={colors.accent500}
        strokeWidth='1'
      />

      {/* oberes Dreieck (zeigt nach unten) */}
      <polygon
        points={`
    ${nominalX - 3},${linesTopBottom - marginOfLines}
    ${nominalX + 3},${linesTopBottom - marginOfLines}
    ${nominalX},${linesTopBottom + 6 - marginOfLines}
  `}
        fill={colors.accent500}
      />

      {/* unteres Dreieck (zeigt nach oben) */}
      <polygon
        points={`
    ${nominalX - 3},${linesBottomTop + marginOfLines}
    ${nominalX + 3},${linesBottomTop + marginOfLines}
    ${nominalX},${linesBottomTop - 6 + marginOfLines}
  `}
        fill={colors.accent500}
      />

      {/* Zahlen unten */}
      <text
        x={tolMinusX}
        y={height - 10}
        textAnchor='middle'
        fontSize='14'
        fill={colors.gray500}
      >
        {fmt(leftValue)}
      </text>
      <text
        x={nominalX}
        y={height - 10}
        textAnchor='middle'
        fontSize='14'
        fill={colors.gray500}
      >
        {fmt(nominal)}
      </text>
      <text
        x={tolPlusX}
        y={height - 10}
        textAnchor='middle'
        fontSize='14'
        fill={colors.gray500}
      >
        {fmt(rightValue)}
      </text>
    </svg>
  );
}
