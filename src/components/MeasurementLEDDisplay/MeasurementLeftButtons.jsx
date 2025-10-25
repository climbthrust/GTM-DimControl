import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function MeasurementLeftButtons({ onReset }) {
  const base =
    'flex items-center justify-center border border-gtm-gray-800 rounded-sm text-gtm-gray-800 hover:bg-gtm-accent-600 select-none transition duration-300';

  return (
    <div className='relative flex items-center justify-center gap-2'>
      {/* Reset */}
      <button
        type='button'
        className={base}
        onClick={onReset}
        title='Messung zurücksetzen'
        style={{ width: 36, height: 36 }}
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
}
