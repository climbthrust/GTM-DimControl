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
  const [displayValue, setDisplayValue] = useState(value?.toString() || '');
  const [animatedValue, setAnimatedValue] = useState(value || 0);

  // --- Zustand bestimmen ----------------------------------------------------
  const state = useMemo(() => {
    const num = parseFloat(displayValue.replace(',', '.'));
    if (isNaN(num)) return 'neutral';
    const lower = nominal - tolMinus;
    const upper = nominal + tolPlus;
    if (num < lower || num > upper) return 'fail';
    return 'ok';
  }, [displayValue, nominal, tolPlus, tolMinus]);

  // --- Farben ---------------------------------------------------------------
  const colors = { accent500: '#ffc027' };

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

  // --- Eingabe behandeln ----------------------------------------------------
  const handleChange = e => {
    const val = e.target.value;
    setDisplayValue(val);
    const num = parseFloat(val.replace(',', '.'));
    if (!isNaN(num)) onChange?.(num);
  };

  // --- Sanftes Nachlaufen ---------------------------------------------------
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

  // --- Skalen-Positionen ----------------------------------------------------
  const { indicatorX, nominalX } = useMemo(() => {
    const width = 420;
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

    return { indicatorX: x, nominalX };
  }, [animatedValue, nominal, tolPlus, tolMinus]);

  // --- Render ---------------------------------------------------------------
  return (
    <div className='flex flex-col items-center justify-start w-full h-full gap-4'>
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
      <div className='relative bg-gtm-gray-800 rounded-sm border border-gtm-gray-600 w-[420px] h-[100px]'>
        {/* === Skala === */}
        <MeasurementScaleSVG
          nominal={nominal}
          tolPlus={tolPlus}
          tolMinus={tolMinus}
          value={animatedValue}
          state={state}
        />

        {/* === Weißer Messbalken === */}
        <div
          className='absolute top-[30px] h-[38px] w-[6px] bg-white transition-transform duration-300 ease-out'
          style={{ transform: `translateX(${indicatorX - 3}px)` }}
        />

        {/* === Nominal-Marker (Linie + Dreiecke) === */}
        <svg
          className='absolute top-0 left-0 pointer-events-none'
          width='420'
          height='100'
        >
          <line
            x1={nominalX}
            y1={30}
            x2={nominalX}
            y2={70}
            stroke={colors.accent500}
            strokeWidth='1'
          />
          <polygon
            points={`${nominalX - 3},30 ${nominalX + 3},30 ${nominalX},36`}
            fill={colors.accent500}
          />
          <polygon
            points={`${nominalX - 3},70 ${nominalX + 3},70 ${nominalX},64`}
            fill={colors.accent500}
          />

          {/* <line
        x1={nominalX}
        y1={linesTopBottom - marginOfLines}
        x2={nominalX}
        y2={linesBottomTop + marginOfLines}
        stroke={colors.accent500}
        strokeWidth='1'
      />

      <polygon
        points={`
    ${nominalX - 3},${linesTopBottom - marginOfLines}
    ${nominalX + 3},${linesTopBottom - marginOfLines}
    ${nominalX},${linesTopBottom + 6 - marginOfLines}
  `}
        fill={colors.accent500}
      />

      <polygon
        points={`
    ${nominalX - 3},${linesBottomTop + marginOfLines}
    ${nominalX + 3},${linesBottomTop + marginOfLines}
    ${nominalX},${linesBottomTop - 6 + marginOfLines}
  `} 
        fill={colors.accent500}
      />*/}
        </svg>
      </div>
    </div>
  );
}
