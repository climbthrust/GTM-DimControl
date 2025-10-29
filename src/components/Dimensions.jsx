import React, { useState, useEffect } from 'react';
import Frame from './Frame';
import MeasurementFrame from './measurement-frame/MeasurementFrame';
import DimensionsTable from './DimensionsTable';

export default function Dimensions({
  dimensions,
  measurementTools,
  highlighted,
  onAllMeasured,
  openToolModal,
}) {
  const [dimensionsWithValues, setDimensionsWithValues] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // === Initialisierung ===
  useEffect(() => {
    if (dimensions && dimensions.length > 0) {
      queueMicrotask(() => {
        const initialized = dimensions.map(d => ({
          ...d,
          measuredValue: d.measuredValue ?? null,
        }));
        setDimensionsWithValues(initialized);
        setCurrentIndex(0);
      });
    } else {
      queueMicrotask(() => {
        setDimensionsWithValues([]);
        setCurrentIndex(0);
      });
    }
  }, [dimensions]);

  // === Messwert speichern ===
  const handleSaveValue = (id, value) => {
    setDimensionsWithValues(prev => {
      const updated = prev.map(d =>
        d.id === id ? { ...d, measuredValue: value } : d
      );

      // prüfen, ob jetzt alle gemessen sind
      const allMeasured =
        updated.length > 0 &&
        updated.every(d => d.measuredValue !== null && d.measuredValue !== '');

      if (allMeasured && typeof onAllMeasured === 'function') {
        onAllMeasured(); // <=== Rückmeldung an App.jsx
      }

      return updated;
    });
  };

  const nextRow = () => {
    if (!dimensionsWithValues?.length) return;
    setCurrentIndex(i => (i + 1) % dimensionsWithValues.length);
  };

  const currentDim = dimensionsWithValues?.[currentIndex] || null;

  // === Rendering ===
  return (
    <Frame highlighted={highlighted}>
      <div className='flex flex-col gap-2 items-center justify-center w-full h-full'>
        <div className='text-4xl mb-3 text-center text-gtm-gray-100'>
          {currentDim?.name ? (
            currentDim.name
          ) : (
            <span className='text-gtm-gray-600 italic'>
              Kein Messpunkt geladen
            </span>
          )}
        </div>

        <div className='flex gap-2 w-full h-full'>
          {/* === Spalte 1: Messung + Tabelle === */}
          <div className='flex flex-col gap-2 min-h-0'>
            <div className='flex-none'>
              <MeasurementFrame
                dim={currentDim}
                onSave={handleSaveValue}
                onNext={nextRow}
                measurementTools={measurementTools}
                openToolModal={openToolModal}
              />
            </div>

            <div className='flex-1 overflow-auto rounded-sm min-h-0'>
              <DimensionsTable
                dimensions={dimensionsWithValues}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </div>
          </div>

          {/* === Spalte 3: Bildbereich === */}
          <div className='w-full border border-gtm-gray-700 rounded-sm flex items-center justify-center'>
            <p className='text-gtm-gray-600 italic text-base'>Kein Bild</p>
          </div>
        </div>
      </div>
    </Frame>
  );
}
