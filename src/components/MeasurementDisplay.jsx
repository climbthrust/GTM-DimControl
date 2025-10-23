import React, { useMemo, useState } from 'react';
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

  // --- Zustand bestimmen ----------------------------------------------------
  const state = useMemo(() => {
    const num = parseFloat(displayValue.replace(',', '.'));
    if (isNaN(num)) return 'neutral';
    const lower = nominal - tolMinus;
    const upper = nominal + tolPlus;
    if (num < lower || num > upper) return 'fail';
    return 'ok';
  }, [displayValue, nominal, tolPlus, tolMinus]);

  // --- Farben abhängig vom Zustand ------------------------------------------
  let bgClass = '';
  switch (state) {
    case 'ok':
      bgClass = 'bg-gtm-ok-900';
      break;
    case 'fail':
      bgClass = 'bg-gtm-fail-700';
      break;
    default:
      bgClass = 'bg-gtm-gray-800';
  }

  // --- Eingabe behandeln ----------------------------------------------------
  const handleChange = e => {
    const val = e.target.value;
    setDisplayValue(val);
    const num = parseFloat(val.replace(',', '.'));
    if (!isNaN(num)) {
      onChange?.(num);
    }
  };

  return (
    <div className='flex flex-col items-center justify-start w-full h-full gap-4'>
      {/* === Oberes Eingabefeld === */}
      <input
        type='text' // <— jetzt TEXT statt number
        inputMode='decimal'
        value={displayValue}
        onChange={handleChange}
        placeholder='–'
        className={`text-4xl font-semibold text-center text-gtm-gray-100 ${bgClass}
                    w-64 py-2 rounded-md focus:outline-none
                    focus:ring-4 focus:ring-gtm-accent-600 transition-all`}
      />

      <MeasurementScaleSVG
        nominal={nominal}
        tolPlus={tolPlus}
        tolMinus={tolMinus}
        value={parseFloat(displayValue.replace(',', '.'))}
        state={state}
      />
    </div>
  );
}
