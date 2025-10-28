import React, { useState, useEffect, useRef } from 'react';
import MeasurementLedPanel from './led-display/MeasurementLEDPanel';
import GTMButton from '../basics/GTMButton';
import Scale from './scale/Scale';

export default function MeasurementDisplay({
  nominal = 0,
  tolPlus = 0.1,
  tolMinus = 0.1,
  value = '',
  unit = '',
  step = 0.001,
  onChange,
  onConfirm,
  onReset,
  disabled,
}) {
  const [currentValue, setCurrentValue] = useState(
    !isNaN(value) && value !== '' ? parseFloat(value) : nominal
  );
  const [state, setState] = useState('neutral');
  const [dirty, setDirty] = useState(false);

  // Press & Hold Timer
  const holdTimeout = useRef(null);
  const repeatInterval = useRef(null);
  const speedUpTimeout = useRef(null);

  // Keyboard-Hold State
  const keyHoldActive = useRef(false);
  const keyHoldDir = useRef(0);

  // === Refs für aktuelle Werte ===
  const currentValueRef = useRef(currentValue);
  const dirtyRef = useRef(dirty);

  useEffect(() => {
    currentValueRef.current = currentValue;
  }, [currentValue]);

  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  const updateState = val => {
    const lower = nominal - tolMinus;
    const upper = nominal + tolPlus;
    if (isNaN(val)) return setState('neutral');
    setState(val < lower || val > upper ? 'fail' : 'ok');
  };

  useEffect(() => {
    if (value === '' || value == null || isNaN(value)) {
      setCurrentValue(nominal);
      setState('neutral');
      setDirty(false);
    } else {
      const num = parseFloat(value);
      setCurrentValue(num);
      updateState(num);
      setDirty(false);
    }
  }, [value, nominal, tolPlus, tolMinus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(holdTimeout.current);
      clearInterval(repeatInterval.current);
      clearTimeout(speedUpTimeout.current);
    };
  }, []);

  const adjustValue = direction => {
    if (disabled) return;
    setCurrentValue(prev => {
      const next = parseFloat((prev + direction * step).toFixed(6));
      updateState(next);
      setDirty(true);
      onChange?.(next);
      return next;
    });
  };

  const startHold = direction => {
    if (disabled) return;
    adjustValue(direction);

    holdTimeout.current = setTimeout(() => {
      let interval = 100;
      const accelFactor = 5;

      repeatInterval.current = setInterval(
        () => adjustValue(direction),
        interval
      );

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
    onReset?.();
    setCurrentValue(nominal);
    setState('neutral');
    setDirty(false);
  };

  const confirmNow = () => {
    onConfirm?.(currentValueRef.current);
    setDirty(false);
  };

  // === Keyboard: + / - / Enter =============================================
  useEffect(() => {
    const isPlusKey = e =>
      e.key === '+' || e.code === 'Equal' || e.code === 'NumpadAdd';
    const isMinusKey = e =>
      e.key === '-' || e.code === 'Minus' || e.code === 'NumpadSubtract';

    const onKeyDown = e => {
      if (disabled || e.ctrlKey || e.metaKey || e.altKey) return;

      // === ENTER → bestätigen (nur wenn dirty) ===
      if (e.key === 'Enter' || e.code === 'NumpadEnter') {
        if (dirtyRef.current) {
          e.preventDefault();
          stopHold();
          onConfirm?.(currentValueRef.current);
          setDirty(false);
        }
        return;
      }

      // === + / - → manuelles Hold-System ===
      if (isPlusKey(e) || isMinusKey(e)) {
        // native Key-Repeat komplett blocken
        if (keyHoldActive.current) {
          e.preventDefault();
          return;
        }
        e.preventDefault();

        const dir = isPlusKey(e) ? +1 : -1;
        keyHoldActive.current = true;
        keyHoldDir.current = dir;
        startHold(dir);
      }
    };

    const onKeyUp = e => {
      // nur beenden, wenn wirklich der gleiche Key losgelassen wurde
      if (!keyHoldActive.current) return;
      if (
        (isPlusKey(e) && keyHoldDir.current === +1) ||
        (isMinusKey(e) && keyHoldDir.current === -1)
      ) {
        keyHoldActive.current = false;
        keyHoldDir.current = 0;
        stopHold();
      }
    };

    const onWindowBlur = () => {
      keyHoldActive.current = false;
      keyHoldDir.current = 0;
      stopHold();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onWindowBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onWindowBlur);
    };
  }, [disabled, step, onConfirm]);

  useEffect(() => {
    if (disabled) {
      keyHoldActive.current = false;
      keyHoldDir.current = 0;
      stopHold();
    }
  }, [disabled]);

  const DISPLAY_WIDTH = 360;

  return (
    <div
      className='grid grid-rows-2 grid-cols-[auto,360px,auto] gap-x-2 gap-y-4 items-center justify-items-center select-none'
      data-measurement-display
    >
      {/* === Zeile 1 === */}
      <div className='flex justify-end w-full'>
        <GTMButton
          icon='reset'
          onClick={resetValue}
          title='Messung zurücksetzen'
          disabled={disabled}
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
          icon='plus'
          onMouseDown={() => startHold(+1)}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={() => startHold(+1)}
          onTouchEnd={stopHold}
          disabled={disabled}
        />
        <GTMButton
          icon='minus'
          onMouseDown={() => startHold(-1)}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={() => startHold(-1)}
          onTouchEnd={stopHold}
          disabled={disabled}
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
          disabled={!dirty || disabled}
          onClick={confirmNow}
          title='Messwert bestätigen'
          data-ok-button
        />
      </div>
    </div>
  );
}
