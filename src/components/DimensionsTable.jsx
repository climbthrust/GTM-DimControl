import React, { useEffect } from 'react';
import { getPrecisionSettings } from '../utils/getPrecisionSettings';

const DimensionsTable = ({ dimensions, currentIndex, setCurrentIndex }) => {
  // === Statusberechnung ===
  const getRowStatus = (dim, value) => {
    if (value === '' || value == null || isNaN(value)) return 'neutral';
    const v = parseFloat(value);
    const lower = dim.nominal - Math.abs(dim.tol_minus);
    const upper = dim.nominal + Math.abs(dim.tol_plus);
    return v >= lower && v <= upper ? 'ok' : 'fail';
  };

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentIndex(prev => Math.min(dimensions.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dimensions.length, setCurrentIndex]);

  return (
    <div>
      <div className='w-full'>
        {/* Kopfzeile */}

        <div className='grid grid-cols-[60px_1fr_90px_70px_70px_60px_90px_40px] text-sm font-semibold rounded-sm text-gtm-gray-600 border border-gtm-gray-700'>
          <div className='p-2'>ID</div>
          <div className='p-2'>Bezeichnung</div>
          <div className='p-2 text-right'>−Tol</div>
          <div className='p-2 text-right'>Soll</div>
          <div className='p-2 text-right'>+Tol</div>
          <div className='p-2 text-left'>Einheit</div>
          <div className='p-2 text-right'>Ist</div>
        </div>

        {/* Zeilen */}
        <div className='flex flex-col'>
          {!dimensions?.length && (
            <div className='text-center text-gtm-gray-600 border border-gtm-gray-700 italic font-normal p-6'>
              Keine Messpunkte vorhanden
            </div>
          )}
          {dimensions.map((dim, i) => {
            const { displayDecimals } = getPrecisionSettings(
              dim.tol_plus,
              dim.tol_minus
            );
            const value = dim.measuredValue;
            const status = getRowStatus(dim, value);
            const active = i === currentIndex;
            const last = i === dimensions.length - 1;

            // Einheitliche Border-Breite
            const borderColor = active
              ? 'border-gtm-accent-500'
              : 'border-gtm-gray-700';
            const borderClasses = last
              ? `border-t border-x border-b ${borderColor}`
              : `border-t border-x ${borderColor}`;

            // const bg = active
            //   ? 'bg-gtm-gray-800'
            //   : 'bg-gtm-gray-800 hover:bg-gtm-gray-700';

            let valueClass =
              'text-right text-lg font-semibold text-gtm-gray-400';
            if (status === 'ok')
              valueClass = 'text-right text-lg font-bold text-gtm-ok-400';
            if (status === 'fail')
              valueClass = 'text-right text-lg font-bold text-gtm-fail-400';

            const formattedValue =
              value != null && value !== ''
                ? parseFloat(value).toFixed(displayDecimals)
                : '–';

            return (
              <div
                key={dim.id}
                onClick={() => setCurrentIndex(i)}
                className={`grid grid-cols-[60px_1fr_90px_70px_70px_60px_90px_40px]
        transition-colors duration-100 cursor-pointer bg-gtm-gray-800 hover:bg-gtm-gray-700 border ${borderClasses}`}
              >
                <div className='p-2'>{dim.id}</div>
                <div className='p-2'>{dim.name}</div>
                <div className='p-2 text-right text-gtm-gray-500'>
                  −{dim.tol_minus.toFixed(displayDecimals)}
                </div>
                <div className='p-2 text-right'>
                  {dim.nominal.toFixed(displayDecimals)}
                </div>
                <div className='p-2 text-right text-gtm-gray-500'>
                  +{dim.tol_plus.toFixed(displayDecimals)}
                </div>
                <div className='p-2 text-gtm-gray-500'>{dim.unit}</div>
                <div className={`p-2 ${valueClass}`}>{formattedValue}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DimensionsTable;
