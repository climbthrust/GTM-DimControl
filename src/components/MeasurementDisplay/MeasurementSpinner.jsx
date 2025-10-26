import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function MeasurementSpinner({ step, onUp, onDown }) {
  const base =
    'flex items-center justify-center border border-gtm-gray-800 rounded-sm text-gtm-gray-800 hover:bg-gtm-accent-600 select-none transition duration-300 w-9 h-9 ';

  return (
    <div className='relative flex items-center justify-start'>
      <div className='flex flex-col justify-between h-full'>
        <button
          type='button'
          className={base}
          title={`Wert erhöhen (Schritt ${step})`}
          onClick={onUp}
        >
          <ChevronUp size={18} />
        </button>

        <button
          type='button'
          className={base}
          title={`Wert verringern (Schritt ${step})`}
          onClick={onDown}
        >
          <ChevronDown size={18} />
        </button>
      </div>
    </div>
  );
}
