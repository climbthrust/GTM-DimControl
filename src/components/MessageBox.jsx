import React, { useEffect, useRef } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function MessageBox({ type = 'ok', text, onClose }) {
  const overlayRef = useRef();

  useEffect(() => {
    const handleKey = e => {
      if (['Escape', 'Enter', 'Tab'].includes(e.key)) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleOverlayClick = e => {
    if (e.target === overlayRef.current) onClose();
  };

  const isOk = type === 'ok';
  const iconColor = isOk ? 'text-gtm-ok-400' : 'text-gtm-fail-400';
  const borderColor = isOk ? 'border-gtm-ok-400' : 'border-gtm-fail-400';

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'
    >
      <div
        className={`relative flex items-center gap-4 p-6 rounded-lg shadow-xl border ${borderColor} bg-gtm-gray-800 text-gtm-gray-100 `}
      >
        <div className='flex items-center'>
          {isOk ? (
            <CheckCircle size={64} className={iconColor} />
          ) : (
            <AlertTriangle size={64} className={iconColor} />
          )}
        </div>

        <div className='flex-1'>
          <div className='text-4xl mb-6'>
            {isOk ? 'Messung abgeschlossen' : 'Achtung'}
          </div>
          <div className='text-xl leading-snug whitespace-pre-line'>{text}</div>
        </div>

        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gtm-gray-400 hover:text-gtm-gray-200'
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
