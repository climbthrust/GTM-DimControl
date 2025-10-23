import React, { useState, useEffect, useMemo } from 'react';
import MeasurementTool from './MeasurementTool';
import { getPrecisionSettings } from '../utils/getPrecisionSettings';

export default function MeasurementFrame({
  dim,
  value,
  onSave,
  onNext,
  measurementTools,
  onMoveUp,
  onMoveDown,
}) {
  const [currentValue, setCurrentValue] = useState(value || '');
  const [connectedDeviceId, setConnectedDeviceId] = useState(null);

  useEffect(() => {
    setCurrentValue(value || '');
  }, [dim.id]);

  const { displayDecimals, step } = useMemo(
    () => getPrecisionSettings(dim.tol_plus, dim.tol_minus),
    [dim.tol_plus, dim.tol_minus]
  );

  const handleConfirm = () => {
    if (currentValue !== '' && !isNaN(currentValue)) {
      onSave(dim.id, currentValue);
    }
    onNext();
  };

  const handleBlur = () => {
    if (currentValue === '' || isNaN(currentValue)) return;
    setCurrentValue(parseFloat(currentValue).toFixed(displayDecimals));
  };

  const handleKeyDown = e => {
    switch (e.key) {
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        handleConfirm();
        break;
      case 'ArrowDown':
        e.preventDefault();
        onMoveDown && onMoveDown();
        break;
      case 'ArrowUp':
        e.preventDefault();
        onMoveUp && onMoveUp();
        break;
      default:
        break;
    }
  };

  return (
    <div className='flex w-full h-56 gap-2'>
      <div className='flex flex-col justify-between flex-1 p-4 border border-gtm-gray-700 rounded-sm bg-gtm-gray-900'>
        <div className='flex w-full justify-between items-center max-w-3xl mx-auto'>
          <div className='flex-grow text-center'>
            <p className='text-2xl text-gtm-text-200'>
              Soll: {dim.nominal.toFixed(displayDecimals)} {dim.unit}
            </p>
            <p className='text-xl text-gtm-text-400'>
              Toleranz: +{dim.tol_plus.toFixed(displayDecimals)} / −
              {dim.tol_minus.toFixed(displayDecimals)}
            </p>
          </div>

          <div className='flex gap-4'>
            <input
              type='number'
              inputMode='decimal'
              step={step}
              value={currentValue}
              onChange={e => setCurrentValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className='text-4xl text-center bg-white text-gtm-text-900 px-6 py-3 rounded-lg w-56 focus:outline-none focus:ring-4 focus:ring-gtm-accent-400'
              placeholder='Ist-Wert'
              autoFocus
            />

            <button
              onClick={handleConfirm}
              className='text-xl px-6 py-3 rounded-lg transition-colors bg-gtm-accent-500 hover:bg-gtm-accent-400 text-gtm-text-900'
            >
              Weiter
            </button>
          </div>
        </div>
      </div>

      <div className='flex-none w-[420px]'>
        <MeasurementTool
          tool={measurementTools.find(t => t.id === dim.measurement_tool_id)}
          connectedDeviceId={connectedDeviceId}
        />
      </div>
    </div>
  );
}
