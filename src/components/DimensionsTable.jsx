import React from 'react';
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

  return (
    <div>
      {!dimensions?.length ? (
        <p className='text-gtm-text-400'>Keine Messpunkte vorhanden</p>
      ) : (
        <div className='w-full'>
          {/* Kopfzeile */}
          <div
            className='grid grid-cols-[60px_1fr_90px_70px_70px_60px_90px_40px]
                                 bg-gtm-gray-700 text-gtm-text-300 text-sm font-semibold'
          >
            <div className='p-2'>ID</div>
            <div className='p-2'>Bezeichnung</div>
            <div className='p-2 text-right'>Soll</div>
            <div className='p-2 text-right'>+Tol</div>
            <div className='p-2 text-right'>−Tol</div>
            <div className='p-2 text-left'>Einheit</div>
            <div className='p-2 text-right'>Ist</div>
          </div>

          {/* Zeilen */}
          <div className='flex flex-col'>
            {dimensions.map((dim, i) => {
              const { displayDecimals } = getPrecisionSettings(
                dim.tol_plus,
                dim.tol_minus
              );
              const value = dim.measuredValue;
              const status = getRowStatus(dim, value);
              const active = i === currentIndex;

              const bg = active
                ? 'bg-gtm-gray-800 border-2 border-gtm-accent-500 z-10 relative'
                : 'bg-gtm-gray-800 border-2 border-gtm-gray-700 hover:bg-gtm-gray-700';

              let valueClass =
                'text-right text-lg font-semibold text-gtm-text-400';
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
                    transition-all duration-100 cursor-pointer ${bg}`}
                >
                  <div className='p-2'>{dim.id}</div>
                  <div className='p-2'>{dim.name}</div>
                  <div className='p-2 text-right'>
                    {dim.nominal.toFixed(displayDecimals)}
                  </div>
                  <div className='p-2 text-right'>
                    +{dim.tol_plus.toFixed(displayDecimals)}
                  </div>
                  <div className='p-2 text-right'>
                    −{dim.tol_minus.toFixed(displayDecimals)}
                  </div>
                  <div className='p-2'>{dim.unit}</div>
                  <div className={`p-2 ${valueClass}`}>{formattedValue}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DimensionsTable;
