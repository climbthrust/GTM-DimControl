import React, { useState, useEffect } from 'react';
import MeasurementLedPanel from './LEDDisplay/MeasurementLEDPanel';
import GTMButton from '../Basics/GTMButton';
import Scale from './Scale/Scale';

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

  // === Einheitliche Breite für LED + Skala ===
  const DISPLAY_WIDTH = 420;
  const DISPLAY_HEIGHT = 100;

  return (
    <div className='grid grid-rows-2 grid-cols-[auto,420px,auto] gap-x-2 gap-y-4 items-center justify-items-center'>
      {/* === Zeile 1 === */}
      <div className='flex justify-end w-full'>
        <GTMButton
          icon='reset'
          onClick={resetValue}
          title='Messung zurücksetzen'
        />
      </div>

      <div style={{ width: DISPLAY_WIDTH }}>
        <MeasurementLedPanel
          nominal={nominal}
          tolPlus={tolPlus}
          tolMinus={tolMinus}
          value={currentValue}
          state={state}
        />
      </div>

      <div className='flex flex-col justify-between items-start w-full h-full'>
        <GTMButton icon='up' onClick={() => adjustValue(+1)} />
        <GTMButton icon='down' onClick={() => adjustValue(-1)} />
      </div>

      {/* === Zeile 2 === */}
      <div></div>

      <div style={{ width: DISPLAY_WIDTH }}>
        <Scale
          nominal={nominal}
          tolPlus={tolPlus}
          tolMinus={tolMinus}
          value={currentValue}
          state={state}
        />
      </div>

      <div className='flex justify-start w-full'>
        <GTMButton
          icon='ok'
          active={dirty}
          disabled={!dirty}
          onClick={confirmValue}
          title='Messwert bestätigen'
        />
      </div>
    </div>
  );
}
