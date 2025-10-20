import React, { useState, useEffect } from 'react';
import Frame from './Frame';
import GTMImage from './GTMImage';
import MeasurementFrame from './MeasurementFrame';
import { getPrecisionSettings } from '../utils/getPrecisionSettings';

export default function Dimensions({ dimensions, measurementTools }) {
  const [values, setValues] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (dimensions && dimensions.length > 0) setCurrentIndex(0);
  }, [dimensions]);

  const handleSaveValue = (id, value) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  // === Tastatur- und Navigationslogik ===
  const handleNext = () => {
    if (!dimensions?.length) return;
    setCurrentIndex(i => (i + 1) % dimensions.length); // Wrap
  };

  const moveDown = () => {
    if (!dimensions?.length) return;
    setCurrentIndex(i => (i + 1) % dimensions.length); // Wrap
  };

  const moveUp = () => {
    if (!dimensions?.length) return;
    setCurrentIndex(i => (i > 0 ? i - 1 : 0)); // kein Wrap nach oben
  };

  // === Statusberechnung ===
  const getRowStatus = (dim, value) => {
    if (value === '' || value == null || isNaN(value)) return 'neutral';
    const v = parseFloat(value);
    const lower = dim.nominal - Math.abs(dim.tol_minus);
    const upper = dim.nominal + Math.abs(dim.tol_plus);
    return v >= lower && v <= upper ? 'ok' : 'fail';
  };

  const currentDim = dimensions?.[currentIndex] || null;

  return (
    <Frame>
      <div className='flex w-full h-full gap-4'>
        {/* === Linke Seite: Messung + Grid === */}
        <div className='flex flex-col w-2/3 h-full'>
          {/* Mess-Frame */}
          <div className='flex-none mb-4'>
            {currentDim && (
              <MeasurementFrame
                dim={currentDim}
                value={values[currentDim.id]}
                onSave={handleSaveValue}
                onNext={handleNext}
                measurementTools={measurementTools}
                onMoveUp={moveUp}
                onMoveDown={moveDown}
              />
            )}
          </div>

          {/* === Grid-Tabelle === */}
          <div className='flex-1 overflow-auto rounded-md'>
            {!dimensions?.length ? (
              <p className='text-gtm-text-400'>Keine Messpunkte vorhanden</p>
            ) : (
              <div className='w-full  px-1'>
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
                <div className='divide-y divide-gtm-gray-700'>
                  {dimensions.map((dim, i) => {
                    const { displayDecimals } = getPrecisionSettings(
                      dim.tol_plus,
                      dim.tol_minus
                    );
                    const value = values[dim.id];
                    const status = getRowStatus(dim, value);
                    const active = i === currentIndex;

                    const bg = active
                      ? 'bg-gtm-gray-800 outline outline-2 outline-gtm-accent-400'
                      : 'bg-gtm-gray-800 hover:bg-gtm-gray-700';

                    let valueClass =
                      'text-right text-lg font-semibold text-gtm-text-400';
                    if (status === 'ok')
                      valueClass =
                        'text-right text-lg font-bold text-gtm-ok-400';
                    if (status === 'fail')
                      valueClass =
                        'text-right text-lg font-bold text-gtm-fail-400';

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
                        <div className={`p-2 ${valueClass}`}>
                          {formattedValue}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* === Rechte Seite: Bildbereich === */}
        <div className='flex-none w-1/3 h-full'>
          <GTMImage width='w-full h-full object-contain' imgUrl='' name='' />
        </div>
      </div>
    </Frame>
  );
}
