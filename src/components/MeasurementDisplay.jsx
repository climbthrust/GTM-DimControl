import React, { useMemo, useState, useEffect } from 'react';
import MeasurementScaleSVG from './MeasurementScaleSVG';

export default function MeasurementDisplay({
  nominal,
  tolPlus,
  tolMinus,
  value,
  unit,
  onChange,
}) {
  // === Globale Layoutparameter =============================================
  const width = 420; // zentrale Breite
  const height = 100; // zentrale Höhe

  // === Zustände ============================================================
  const [displayValue, setDisplayValue] = useState(value?.toString() || '');
  const [animatedValue, setAnimatedValue] = useState(value || 0);

  // === Zustand der Messung bestimmen =======================================
  const state = useMemo(() => {
    const num = parseFloat(displayValue.replace(',', '.'));
    if (isNaN(num)) return 'neutral';
    const lower = nominal - tolMinus;
    const upper = nominal + tolPlus;
    if (num < lower || num > upper) return 'fail';
    return 'ok';
  }, [displayValue, nominal, tolPlus, tolMinus]);

  // === Farben ==============================================================
  const colors = {
    accent500: '#ffc027',
    white: '#ffffff',
  };

  let bgClass = '';
  switch (state) {
    case 'ok':
      bgClass = 'bg-gtm-ok-900';
      break;
    case 'fail':
      bgClass = 'bg-gtm-fail-800';
      break;
    default:
      bgClass = 'bg-gtm-gray-800';
  }

  // === Eingabe behandeln ===================================================
  const handleChange = e => {
    const val = e.target.value;
    setDisplayValue(val);
    const num = parseFloat(val.replace(',', '.'));
    if (!isNaN(num)) onChange?.(num);
  };

  // === Sanftes Nachlaufen des Messwerts ====================================
  useEffect(() => {
    const target = parseFloat(displayValue.replace(',', '.'));
    if (isNaN(target)) return;
    const interval = setInterval(() => {
      setAnimatedValue(prev => {
        const diff = target - prev;
        if (Math.abs(diff) < 0.01) return target;
        return prev + diff * 0.2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [displayValue]);

  // === Positionsberechnung (beide Balken) ==================================
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

    let x = tolMinusX + ((animatedValue - leftValue) / spanValue) * tolSpanPx;
    if (x < tolMinusX - overshoot) x = tolMinusX - overshoot;
    if (x > tolPlusX + overshoot) x = tolPlusX + overshoot;

    return { indicatorX: x, nominalX, minIndicatorX: tolMinusX - overshoot };
  }, [animatedValue, nominal, tolPlus, tolMinus, width]);

  // === Optikparameter für Nominal-Marker ===================================
  const nominalMarker = {
    lineTop: height * 0.22,
    lineBottom: height * 0.75,
    triangleSize: 3,
    triangleHeight: 6,
    color: colors.accent500,
    strokeWidth: 1,
  };

  // === Render ==============================================================
  return (
    <div className='flex flex-col items-center justify-start w-full h-full gap-4'>
      {/* Eingabefeld */}
      <input
        type='text'
        inputMode='decimal'
        value={displayValue}
        onChange={handleChange}
        placeholder='–'
        className={`text-4xl font-semibold text-center text-gtm-gray-100 ${bgClass}
                    w-64 py-2 rounded-sm focus:outline-none
                    focus:ring-2 focus:ring-gtm-accent-600 transition-all`}
      />

      {/* Messanzeige-Bereich */}
      <div
        className='relative bg-gtm-gray-800 rounded-sm border border-gtm-gray-600'
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {/* === Skala === */}
        <MeasurementScaleSVG
          nominal={nominal}
          tolPlus={tolPlus}
          tolMinus={tolMinus}
          value={animatedValue}
          state={state}
          width={width}
          height={height}
        />

        {state !== 'neutral' && (
          <>
            <div
              className='absolute rounded-sm transition-all duration-200 ease-out'
              style={{
                height: `${height * 0.38}px`,
                width: `${indicatorX - (minIndicatorX - 3)}px`, // Dynamische Breite vom min bis aktuelle Position
                left: `${minIndicatorX - 3}px`, // Startpunkt (minimaler Balkenwert)
                top: `${height * 0.3}px`,
                background: `linear-gradient(
      to right,
      rgba(245,245,245,0) 0%,
      rgba(245,245,245,0.15) 100%
    )`,
                pointerEvents: 'none',
              }}
            />

            <div
              className='absolute bg-white transition-transform duration-300 ease-out'
              style={{
                width: '6px',
                height: `${height * 0.38}px`,
                top: `${height * 0.3}px`,
                transform: `translateX(${indicatorX - 3}px)`,
                zIndex: 10, // über dem Schweif
              }}
            />
          </>
        )}

        {/* === Weißer Messbalken === */}
        {/* <div
          className='absolute bg-gtm-gray-100 transition-transform duration-300 ease-out'
          style={{
            width: '6px',
            height: `${height * 0.38}px`,
            top: `${height * 0.3}px`,
            transform: `translateX(${indicatorX - 3}px)`,
          }}
        /> */}

        {/* === Nominal-Marker (Linie + Dreiecke) === */}
        <svg
          className='absolute top-0 left-0 pointer-events-none'
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
              ${nominalX},${
              nominalMarker.lineTop + nominalMarker.triangleHeight
            }
            `}
            fill={nominalMarker.color}
          />
          <polygon
            points={`
              ${nominalX - nominalMarker.triangleSize},${
              nominalMarker.lineBottom
            }
              ${nominalX + nominalMarker.triangleSize},${
              nominalMarker.lineBottom
            }
              ${nominalX},${
              nominalMarker.lineBottom - nominalMarker.triangleHeight
            }
            `}
            fill={nominalMarker.color}
          />
        </svg>
      </div>
    </div>
  );
}
