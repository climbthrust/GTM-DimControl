import React, { useState, useEffect } from 'react';
import Frame from './Frame';
import GTMImage from './GTMImage';
import MeasurementFrame from './MeasurementFrame';
import DimensionsTable from './DimensionsTable';

export default function Dimensions({
  dimensions,
  measurementTools,
  highlighted,
}) {
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

  const currentDim = dimensions?.[currentIndex] || null;

  return (
    <Frame highlighted={highlighted}>
      <div className='flex flex-col gap-2 items-center justify-center w-full h-full'>
        <div className='text-4xl mb-3 text-center text-gtm-text-100'>
          {currentDim?.name}
        </div>
        <div className='flex w-full h-full gap-2'>
          {/* === Linke Seite: Messung + Grid === */}
          <div className='flex flex-col w-2/3 h-full gap-2 min-h-0'>
            {/* Mess-Frame */}
            <div className='flex-none'>
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
            <div className='flex-1 overflow-auto rounded-sm min-h-0'>
              <DimensionsTable
                dimensions={dimensions}
                values={values}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </div>
          </div>

          {/* === Rechte Seite: Bildbereich === */}
          <div className='flex w-1/3 h-full min-h-0'>
            <div className='w-full h-full border border-gtm-gray-700 bg-gtm-gray-800 rounded-sm flex items-center justify-center'>
              <p className='text-gtm-text-400'>Kein Bild</p>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
