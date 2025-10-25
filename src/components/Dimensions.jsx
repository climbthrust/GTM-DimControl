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
  const [dimensionsWithValues, setDimensionsWithValues] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // === Initialisierung ===
  useEffect(() => {
    if (dimensions && dimensions.length > 0) {
      // Kopie der Dimensionen mit zusätzlichem Feld measuredValue
      const initialized = dimensions.map(d => ({
        ...d,
        measuredValue: d.measuredValue ?? null,
      }));
      setDimensionsWithValues(initialized);
      setCurrentIndex(0);
    }
  }, [dimensions]);

  // === Messwert speichern ===
  const handleSaveValue = (id, value) => {
    setDimensionsWithValues(prev =>
      prev.map(d => (d.id === id ? { ...d, measuredValue: value } : d))
    );
  };

  // === Tastatur- und Navigationslogik ===
  const handleNext = () => {
    if (!dimensionsWithValues?.length) return;
    setCurrentIndex(i => (i + 1) % dimensionsWithValues.length); // Wrap
  };

  const moveDown = () => {
    if (!dimensionsWithValues?.length) return;
    setCurrentIndex(i => (i + 1) % dimensionsWithValues.length); // Wrap
  };

  const moveUp = () => {
    if (!dimensionsWithValues?.length) return;
    setCurrentIndex(i => (i > 0 ? i - 1 : 0)); // kein Wrap nach oben
  };

  const currentDim = dimensionsWithValues?.[currentIndex] || null;

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
                dimensions={dimensionsWithValues}
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
