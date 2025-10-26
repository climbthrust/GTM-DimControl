import React, { useState, useEffect } from 'react';
import MeasurementLedPanel from './MeasurementLedPanel';
import MeasurementLeftButtons from './MeasurementLeftButtons';
import MeasurementScaleSVG from './MeasurementScaleSVG';
import MeasurementSpinner from './MeasurementSpinner';
import { Check } from 'lucide-react';

export default function MeasurementDisplay({
  nominal,
  tolPlus,
  tolMinus,
  value,
  unit,
  step = 0.001,
  onChange,
  onConfirm,
  onReset,
}) {
  const [currentValue, setCurrentValue] = useState(
    value && !isNaN(value) ? parseFloat(value) : nominal || 0
  );
  const [state, setState] = useState('neutral');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (value === '' || value == null || isNaN(value)) {
      setCurrentValue(nominal || 0);
      setState('neutral');
      setDirty(false);
    } else {
      const num = parseFloat(value);
      setCurrentValue(num);
      updateState(num);
      setDirty(false);
    }
  }, [value, nominal, tolPlus, tolMinus]);

  const updateState = val => {
    const lower = nominal - tolMinus;
    const upper = nominal + tolPlus;
    setState(val < lower || val > upper ? 'fail' : 'ok');
  };

  const adjustValue = direction => {
    const newVal = parseFloat((currentValue + direction * step).toFixed(6));
    setCurrentValue(newVal);
    updateState(newVal);
    setDirty(true);
    onChange?.(newVal);
  };

  const resetValue = () => {
    onReset?.();
    setCurrentValue(nominal || 0);
    setState('neutral');
    setDirty(false);
  };

  const confirmValue = () => {
    onConfirm?.(currentValue);
    setDirty(false);
  };

  return (
    <div className='flex flex-col items-stretch justify-between w-full h-full gap-3 select-none'>
      {/* === Zeile 1: Reset | LED | Spinner === */}
      <div className='grid grid-cols-[auto,1fr,auto] items-center w-full gap-4'>
        <MeasurementLeftButtons onReset={resetValue} />

        <div className='flex-grow w-full'>
          <MeasurementLedPanel
            nominal={nominal}
            tolPlus={tolPlus}
            tolMinus={tolMinus}
            value={currentValue}
            state={state}
            step={step}
            dirty={dirty}
          />
        </div>

        <MeasurementSpinner
          step={step}
          onUp={() => adjustValue(+1)}
          onDown={() => adjustValue(-1)}
        />
      </div>

      {/* === Zeile 2: leer | Skala | OK === */}
      <div className='grid grid-cols-[auto,1fr,auto] items-end w-full gap-4'>
        <div></div>

        <div className='flex-grow w-full'>
          <MeasurementScaleSVG
            nominal={nominal}
            tolPlus={tolPlus}
            tolMinus={tolMinus}
            value={currentValue}
            state={state}
            width={800} // bleibt als Referenzgröße für viewBox
            height={100}
          />
        </div>

        <button
          type='button'
          disabled={!dirty}
          className={`w-9 h-9 flex items-center justify-center border border-gtm-gray-800 rounded-sm  select-none transition duration-300 ${
            dirty
              ? 'bg-gtm-accent-500 hover:bg-gtm-accent-600 text-gtm-text-900'
              : 'border-gtm-gray-800 text-gtm-gray-800'
          }`}
          title='Messwert bestätigen'
          onClick={confirmValue}
        >
          <Check size={18} />
        </button>
      </div>
    </div>
  );
}
