import React, { useMemo } from 'react';
import { Check } from 'lucide-react';
import MeasurementScaleSVG from './MeasurementScaleSVG';
import SevenSegmentDigit from './SevenSegmentDigit';
import DecimalPoint from './DecimalPoint';
import MeasurementSpinner from './MeasurementSpinner';
import MeasurementLeftButtons from './MeasurementLeftButtons';

export default function MeasurementLedPanel({
  nominal,
  tolPlus,
  tolMinus,
  value,
  state,
  step,
  dirty,
  onUp,
  onDown,
  onReset,
  onConfirm,
}) {
  const width = 420;
  const height = 100;
  const ledColor =
    state === 'ok' ? '#00ff66' : state === 'fail' ? '#ff3333' : '#a0a0a0';
  const colors = { accent500: '#ffc027' };

  const formatted = useMemo(() => {
    const num = Number.isFinite(value) ? value : 0;
    const fixed = num.toFixed(3);
    const [L, R] = fixed.split('.');
    return {
      left: (L ?? '').padStart(4, ' '),
      right: (R ?? '').padEnd(3, '0'),
    };
  }, [value]);

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

  const nominalMarker = {
    lineTop: height * 0.22,
    lineBottom: height * 0.75,
    triangleSize: 3,
    triangleHeight: 6,
    color: colors.accent500,
    strokeWidth: 2,
  };

  return (
    <div
      className='grid justify-center gap-2'
      style={{
        gridTemplateColumns: 'auto 1fr auto',
        gridTemplateRows: 'auto auto',
        width: `${width + 80}px`,
      }}
    >
      {/* === Zeile 1: Reset | LED | Spinner === */}
      <MeasurementLeftButtons onReset={onReset} />

      <div
        className='flex items-center justify-center bg-black p-4 rounded-md border border-gtm-gray-700'
        style={{
          gap: '10px',
          boxShadow: 'inset 0 0 20px rgba(255,255,255,0.05)',
          width: `${width}px`,
          height: '90px',
        }}
      >
        {formatted.left.split('').map((char, i) => (
          <SevenSegmentDigit key={`L${i}`} char={char} color={ledColor} />
        ))}
        <DecimalPoint color={ledColor} />
        {formatted.right.split('').map((char, i) => (
          <SevenSegmentDigit key={`R${i}`} char={char} color={ledColor} />
        ))}
      </div>

      <MeasurementSpinner step={step} onUp={onUp} onDown={onDown} />

      {/* === Zeile 2: leer | Skala | Confirm === */}
      <div></div>

      <div
        className='relative bg-gtm-gray-800 rounded-sm border border-gtm-gray-600 overflow-hidden'
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <MeasurementScaleSVG
          nominal={nominal}
          tolPlus={tolPlus}
          tolMinus={tolMinus}
          value={value}
          state={state}
          width={width}
          height={height}
        />

        {/* Schweif */}
        <div
          className='absolute rounded-sm transition-all duration-200 ease-out'
          style={{
            height: `${height * 0.38}px`,
            width: `${indicatorX - (minIndicatorX - 3)}px`,
            left: `${minIndicatorX - 4}px`,
            top: `${height * 0.3}px`,
            background: `linear-gradient(
              to right,
              rgba(245,245,245,0) 0%,
              rgba(245,245,245,0.15) 100%
            )`,
          }}
        />

        {/* Zeiger */}
        <div
          className={`absolute ${
            state === 'ok'
              ? 'bg-gtm-ok-400'
              : state === 'fail'
              ? 'bg-gtm-fail-500'
              : 'bg-gtm-gray-300'
          } transition-transform duration-300 ease-out`}
          style={{
            width: '6px',
            height: `${height * 0.38}px`,
            top: `${height * 0.3}px`,
            transform: `translateX(${indicatorX - 3}px)`,
          }}
        />

        {/* Nominal-Marker */}
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

      {/* === Confirm Button (unten rechts) === */}
      <div className='flex items-end justify-end ml-10 '>
        <button
          type='button'
          onClick={onConfirm}
          disabled={!dirty}
          title='Messung bestätigen'
          className={`flex items-center justify-center rounded-md transition-all duration-300 ${
            dirty
              ? 'bg-gtm-accent-500 hover:bg-gtm-accent-300 text-gtm-text-900 shadow-lg'
              : 'border border-gtm-gray-800 text-gtm-gray-800 cursor-not-allowed'
          }`}
          style={{ width: 56, height: 56 }}
        >
          <Check size={28} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
