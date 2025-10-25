import React, { useState, useEffect } from 'react';
import MeasurementLedPanel from './MeasurementLedPanel';

export default function MeasurementLEDDisplay({
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
      const lower = nominal - tolMinus;
      const upper = nominal + tolPlus;
      setState(num < lower || num > upper ? 'fail' : 'ok');
      setDirty(false);
    }
  }, [value, nominal, tolPlus, tolMinus]);

  const updateState = val => {
    const lower = nominal - tolMinus;
    const upper = nominal + tolPlus;
    if (val < lower || val > upper) setState('fail');
    else setState('ok');
  };

  const adjustValue = direction => {
    const newVal = parseFloat((currentValue + direction * step).toFixed(6));
    setCurrentValue(newVal);
    updateState(newVal);
    setDirty(true);
    onChange?.(newVal);
  };

  const resetValue = () => {
    if (onReset) onReset(); // → ruft in MeasurementFrame → onSave(id, null)
    setCurrentValue(nominal || 0);
    setState('neutral');
    setDirty(false);
  };

  const confirmValue = () => {
    if (onConfirm) onConfirm(currentValue);
    setDirty(false);
  };

  return (
    <div className='flex items-start justify-center w-full h-full gap-4 select-none'>
      <MeasurementLedPanel
        nominal={nominal}
        tolPlus={tolPlus}
        tolMinus={tolMinus}
        value={currentValue}
        state={state}
        step={step}
        dirty={dirty}
        onUp={() => adjustValue(+1)}
        onDown={() => adjustValue(-1)}
        onReset={resetValue}
        onConfirm={confirmValue}
      />
    </div>
  );
}
