import React, { useMemo } from 'react';
import MeasurementScaleSVG from './MeasurmentScaleSVG';

export default function MeasurementDisplay({
  nominal,
  tolPlus,
  tolMinus,
  value,
  unit,
  onChange,
}) {
  // --- Zustandsbestimmung ----------------------------------------------------
  const state = useMemo(() => {
    if (value === '' || value === null || isNaN(Number(value)))
      return 'neutral';
    const num = Number(value);
    const lower = nominal - tolMinus;
    const upper = nominal + tolPlus;
    if (num < lower || num > upper) return 'fail';
    return 'ok';
  }, [value, nominal, tolPlus, tolMinus]);

  // --- Farben abhängig vom Zustand ------------------------------------------
  let bgClass = '';
  switch (state) {
    case 'ok':
      bgClass = 'bg-gtm-ok-700';
      break;
    case 'fail':
      bgClass = 'bg-gtm-fail-700';
      break;
    default:
      bgClass = 'bg-gtm-gray-800';
  }

  // --- Anzeigeformat ---------------------------------------------------------
  const formatted =
    value === '' || isNaN(Number(value)) ? '' : Number(value).toString();

  return (
    <div className='flex flex-col items-center justify-start w-full h-full gap-4'>
      {/* === Oberes Eingabefeld === */}
      <input
        type='number'
        inputMode='decimal'
        value={formatted}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder='–'
        className={`text-4xl font-semibold text-center text-gtm-gray-100 ${bgClass}
                    w-64 py-2 rounded-md focus:outline-none
                    focus:ring-4 focus:ring-gtm-accent-600 transition-all`}
      />

      <MeasurementScaleSVG
        nominal={nominal}
        tolPlus={tolPlus}
        tolMinus={tolMinus}
        value={value}
        state={state}
      />
      {/* === Placeholder für künftige Grafik === */}
      {/* <div
        className='flex items-center justify-center w-[420px] h-[180px]
                      bg-gtm-gray-900 rounded-md border border-gtm-gray-700'
      >
        <span className='text-gtm-gray-400 text-sm tracking-wide'>
          (Messvisualisierung folgt)
        </span>
      </div> */}

      {/* === Info unten (Soll + Toleranzen) === */}
      {/* <div className='flex flex-col items-center text-gtm-gray-300 text-base'>
        <div>
          Soll: {nominal} {unit}
        </div>
        <div className='text-sm text-gtm-gray-400'>
          Toleranz: +{tolPlus} / −{tolMinus}
        </div>
      </div> */}
    </div>
  );
}
