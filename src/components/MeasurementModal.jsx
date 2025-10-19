import React, { useEffect, useMemo, useState } from 'react';
import MeasurementTool from './MeasurementTool';

export default function MeasurementModal({
  isOpen,
  onClose,
  dimensions,
  currentIndex,
  onSave,
  measurementTools,
}) {
  const [currentValue, setCurrentValue] = useState('');
  const [isValid, setIsValid] = useState(null);

  const dim = dimensions?.[currentIndex];

  const decimalPlaces = n => {
    if (!n || !isFinite(n)) return 0;
    const s = String(n);
    const idx = s.indexOf('.');
    const dp = idx === -1 ? 0 : s.length - idx - 1;
    return Math.max(0, dp + 1);
  };

  const step = useMemo(() => {
    if (!dim) return 'any';
    const maxDp = decimalPlaces(
      Math.min(Math.abs(dim.tol_plus), Math.abs(dim.tol_minus))
    );
    return Number((1 / Math.pow(10, maxDp)).toFixed(maxDp));
  }, [dim]);

  useEffect(() => {
    setCurrentValue('');
    setIsValid(null);
  }, [dim]);

  useEffect(() => {
    if (!dim || !currentValue || isNaN(currentValue)) {
      setIsValid(null);
      return;
    }
    const v = parseFloat(currentValue);
    const lower = dim.nominal - Math.abs(dim.tol_minus);
    const upper = dim.nominal + Math.abs(dim.tol_plus);
    setIsValid(v >= lower && v <= upper);
  }, [currentValue, dim]);

  useEffect(() => {
    const handler = e => setCurrentValue(String(e.detail));
    window.addEventListener('bluetoothMeasurement', handler);
    return () => window.removeEventListener('bluetoothMeasurement', handler);
  }, []);

  if (!isOpen || !dim) return null;

  const handleNext = () => onSave(dim.id, currentValue);

  const bgStatus =
    isValid === null
      ? 'bg-gtm-gray-900'
      : isValid
      ? 'bg-gtm-accent-500 text-gtm-text-900'
      : 'bg-gtm-gray-800';

  // das passende Tool aus measurementTools holen
  const tool =
    measurementTools?.find(t => t.id === dim.measurement_tool_id) || null;

  return (
    <div
      className={`fixed inset-16 border border-gtm-gray-700 rounded-xl shadow-xl z-50 flex ${bgStatus} text-gtm-text-100 transition-colors`}
    >
      {/* === linke Hälfte: Infos + Eingabe === */}
      <div className='flex flex-col justify-between w-1/2 p-8'>
        <div className='flex flex-col gap-4 justify-between h-full'>
          <div className='flex flex-col h-full justify-center items-center'>
            <h2 className='text-4xl font-semibold mb-6 text-center'>
              {dim.name}
            </h2>

            <div className='bg-gtm-gray-800 border border-gtm-gray-700 rounded-xl px-8 py-6 mb-8'>
              <p className='text-2xl mb-1'>
                <span className='text-gtm-text-300'>Soll:</span> ⌀{' '}
                {Number.isFinite(dim.nominal) ? dim.nominal.toFixed(3) : '–'} mm
              </p>
              <p className='text-xl mb-2'>
                <span className='text-gtm-text-300'>Toleranz:</span> +
                {Number.isFinite(dim.tol_plus) ? dim.tol_plus.toFixed(3) : '–'}{' '}
                / −
                {Number.isFinite(dim.tol_minus)
                  ? dim.tol_minus.toFixed(3)
                  : '–'}
              </p>
            </div>

            <input
              type='number'
              step={step}
              value={currentValue}
              onChange={e => setCurrentValue(e.target.value)}
              className='text-6xl text-center text-gtm-text-900 px-6 py-4 rounded-lg w-72 self-center
                     focus:outline-none focus:ring-4 focus:ring-gtm-accent-400 bg-white'
              placeholder='Ist-Wert'
            />

            <div className='flex gap-8 justify-center mt-12'>
              <button
                onClick={onClose}
                className='bg-gtm-gray-700 hover:bg-gtm-gray-600 text-2xl px-6 py-3 rounded-lg transition-colors'
              >
                Abbrechen
              </button>
              <button
                onClick={handleNext}
                disabled={!currentValue}
                className={`text-2xl px-6 py-3 rounded-lg transition-colors ${
                  currentValue
                    ? 'bg-gtm-accent-500 text-gtm-text-900 hover:bg-gtm-accent-400'
                    : 'bg-gtm-gray-600 text-gtm-text-300 cursor-not-allowed'
                }`}
              >
                Weiter
              </button>
            </div>

            <div className='mt-8 text-center text-gtm-text-300 text-lg'>
              {currentIndex + 1} / {dimensions.length} Maße
            </div>
          </div>
        </div>
        <MeasurementTool tool={tool} />
      </div>

      {/* === rechte Hälfte: Bild + Tool === */}
      <div className='w-1/2 border-l  rounded-r-xl flex flex-col gap-4 p-4'>
        {/* Bild (2/3) */}
        <div className='flex-2 flex items-center justify-center h-2/3'>
          {dim.image_path ? (
            <img
              src={dim.image_path}
              alt={dim.name}
              className='max-h-full max-w-full object-contain rounded-md border border-gtm-gray-700 bg-gtm-gray-900'
            />
          ) : (
            <p className='text-gtm-text-400'>Kein Bild verfügbar</p>
          )}
        </div>

        {/* Tool (1/3) */}
        {/* <div className='flex-1'>
          <MeasurementTool tool={tool} />
        </div> */}
      </div>
    </div>
  );
}
