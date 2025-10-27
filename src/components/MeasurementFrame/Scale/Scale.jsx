import React, { useMemo } from 'react';
import MeasurementScaleSVG from './MeasurementScaleSVG';

export default function Scale({
  nominal,
  tolPlus,
  tolMinus,
  value,
  state = 'neutral',
  width = 420,
  height = 100,
}) {
  // === Farben & Marker-Stile ==============================================
  const colors = {
    accent500: '#ffc027',
    gray100: '#f5f5f5',
  };

  const nominalMarker = {
    lineTop: height * 0.22,
    lineBottom: height * 0.75,
    triangleSize: 3,
    triangleHeight: 6,
    color: colors.accent500,
    strokeWidth: 2,
  };

  // === Wertebereich & Positionen ==========================================
  const { indicatorX, nominalX, minIndicatorX } = useMemo(() => {
    const paddingX = 28;
    const leftValue = nominal - tolMinus;
    const rightValue = nominal + tolPlus;
    const spanValue = Math.max(1e-9, rightValue - leftValue);
    const tolMinusX = paddingX;
    const tolPlusX = width - paddingX;
    const tolSpanPx = tolPlusX - tolMinusX;
    const overshoot = 10;

    const nominalX =
      tolMinusX + ((nominal - leftValue) / spanValue) * tolSpanPx;

    let x = tolMinusX + ((value - leftValue) / spanValue) * tolSpanPx;
    if (x < tolMinusX - overshoot) x = tolMinusX - overshoot;
    if (x > tolPlusX + overshoot) x = tolPlusX + overshoot;

    return { indicatorX: x, nominalX, minIndicatorX: tolMinusX - overshoot };
  }, [value, nominal, tolPlus, tolMinus, width]);

  // === Render =============================================================
  return (
    <div
      className='relative bg-gtm-gray-800 rounded-md border border-gtm-gray-600 select-none'
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* === Basis-Skala (SVG) === */}
      <MeasurementScaleSVG
        nominal={nominal}
        tolPlus={tolPlus}
        tolMinus={tolMinus}
        value={value}
        state={state}
        width={width}
        height={height}
      />

      {/* === Weißer Messbalken + Swoosh === */}

      {/* Schweif */}
      <div
        className='absolute rounded-sm transition-all duration-200 ease-out'
        style={{
          height: `${height * 0.38}px`,
          width: `${indicatorX - (minIndicatorX - 3)}px`,
          left: `${minIndicatorX - 3}px`,
          top: `${height * 0.3}px`,
          background: `linear-gradient(
                to right,
                rgba(245,245,245,0) 0%,
                rgba(245,245,245,0.15) 100%
              )`,
          pointerEvents: 'none',
        }}
      />

      {/* Indikator */}
      <div
        className={`absolute ${
          state === 'neutral'
            ? 'bg-gtm-gray-400'
            : state === 'ok'
            ? 'bg-gtm-ok-400'
            : 'bg-gtm-fail-500'
        } transition-transform duration-300 ease-out`}
        style={{
          width: '6px',
          height: `${height * 0.38}px`,
          top: `${height * 0.3}px`,
          transform: `translateX(${indicatorX - 3}px)`,
          zIndex: 10,
        }}
      />

      {/* === Nominal-Marker === */}
      <svg
        className='absolute top-0 left-0 pointer-events-none z-20'
        width={width}
        height={height}
      >
        <line
          x1={nominalX}
          y1={nominalMarker.lineTop}
          x2={nominalX}
          y2={nominalMarker.lineBottom}
          stroke={nominalMarker.color}
          strokeWidth={nominalMarker.strokeWidth}
        />
        <polygon
          points={`
            ${nominalX - nominalMarker.triangleSize},${nominalMarker.lineTop}
            ${nominalX + nominalMarker.triangleSize},${nominalMarker.lineTop}
            ${nominalX},${nominalMarker.lineTop + nominalMarker.triangleHeight}
          `}
          fill={nominalMarker.color}
        />
        <polygon
          points={`
            ${nominalX - nominalMarker.triangleSize},${nominalMarker.lineBottom}
            ${nominalX + nominalMarker.triangleSize},${nominalMarker.lineBottom}
            ${nominalX},${
            nominalMarker.lineBottom - nominalMarker.triangleHeight
          }
          `}
          fill={nominalMarker.color}
        />
      </svg>
    </div>
  );
}
