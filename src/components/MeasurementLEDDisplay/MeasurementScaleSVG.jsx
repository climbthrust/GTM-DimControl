import React, { useMemo } from 'react';

export default function MeasurementScaleSVG({
  nominal,
  tolPlus,
  tolMinus,
  value,
  state = 'neutral',
  width,
  height,
}) {
  // === Abgeleitete Layout-Konstanten =======================================
  const bandHeight = height * 0.28;
  const paddingX = width * 0.07;
  const marginOfLines = 5;
  const bandTop = height * 0.35;
  const linesTopTop = bandTop - bandHeight * 0.7;
  const linesTopBottom = bandTop - marginOfLines;
  const linesBottomTop = bandTop + bandHeight + marginOfLines;
  const linesBottomBottom = height - 26;

  // === Farben ==============================================================
  const colors = {
    gray100: '#f5f5f5',
    gray500: '#737373',
    gray600: '#525252',
    gray700: '#404040',
    gray800: '#2e2e2e',
    fail700: '#922222',
    fail800: '#6f1818',
    accent500: '#ffc027',
    green700: '#126012',
    green800: '#0C460C',
    green900: '#072c07',
  };

  // === Skala berechnen =====================================================
  const leftValue = nominal - tolMinus;
  const rightValue = nominal + tolPlus;
  const spanValue = Math.max(1e-9, rightValue - leftValue);
  const tolMinusX = paddingX;
  const tolPlusX = width - paddingX;
  const tolSpanPx = tolPlusX - tolMinusX;
  const nominalX = tolMinusX + ((nominal - leftValue) / spanValue) * tolSpanPx;

  // === Formatierung ========================================================
  const fmt = n => Number(n).toFixed(2);

  return (
    <svg width={width} height={height} className='select-none'>
      {/* Toleranzband */}
      <rect
        x={tolMinusX}
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
        strokeWidth={1}
      />

      {/* Toleranzlinien */}
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

      {/* Zahlen */}
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
        y={height - 8}
        textAnchor='middle'
        fontSize='18'
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
