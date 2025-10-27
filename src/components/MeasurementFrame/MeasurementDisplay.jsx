import React, { useState, useEffect, useRef } from 'react';
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

  const holdTimeout = useRef(null);
  const repeatInterval = useRef(null);
  const speedUpTimeout = useRef(null);

  const updateState = val => {
    const lower = nominal - tolMinus;
    const upper = nominal + tolPlus;
    setState(val < lower || val > upper ? 'fail' : 'ok');
  };

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

  useEffect(() => {
    return () => {
      // falls du holdTimeout/repeatInterval Refs hast:
      clearTimeout(holdTimeout.current);
      clearInterval(repeatInterval.current);
    };
  }, []);

  const adjustValue = direction => {
    setCurrentValue(prev => {
      const next = parseFloat((prev + direction * step).toFixed(6));
      updateState(next);
      setDirty(true);
      onChange?.(next);
      return next;
    });
  };

  // === Press & Hold mit Speed-Up, ohne Nachlauf ===
  const startHold = direction => {
    adjustValue(direction); // sofort einmal reagieren

    holdTimeout.current = setTimeout(() => {
      let interval = 100; // Intervall beim Start
      let accelFactor = 5; // Zählung wird um diesen Faktor beschleunigt
      repeatInterval.current = setInterval(
        () => adjustValue(direction),
        interval
      );

      // Speed-Up-Timer separat merken, damit wir ihn stoppen können
      speedUpTimeout.current = setTimeout(() => {
        clearInterval(repeatInterval.current);
        interval = interval / accelFactor;
        repeatInterval.current = setInterval(
          () => adjustValue(direction),
          interval
        );
      }, 1500);
    }, 400);
  };

  const stopHold = () => {
    clearTimeout(holdTimeout.current);
    clearTimeout(speedUpTimeout.current);
    clearInterval(repeatInterval.current);
  };

  const resetValue = () => {
    console.log('resetValue');
    onReset?.();
    setCurrentValue(nominal || 0);
    setState('neutral');
    setDirty(false);
  };

  const confirmValue = () => {
    onConfirm?.(currentValue);
    setDirty(false);
  };

  const DISPLAY_WIDTH = 360;

  return (
    <div
      className={`grid grid-rows-2 grid-cols-[auto,360px,auto] gap-x-2 gap-y-4 items-center justify-items-center select-none`}
    >
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
          width={DISPLAY_WIDTH}
        />
      </div>

      <div className='flex flex-col justify-between items-start w-full h-full'>
        <GTMButton
          icon='up'
          onMouseDown={() => startHold(+1)}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={() => startHold(+1)}
          onTouchEnd={stopHold}
        />
        <GTMButton
          icon='down'
          onMouseDown={() => startHold(-1)}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={() => startHold(-1)}
          onTouchEnd={stopHold}
        />
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
          width={DISPLAY_WIDTH}
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
