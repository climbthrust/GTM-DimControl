import React, { useState, useEffect } from 'react';
import Frame from './Frame';
import GTMImage from './GTMImage';
import MeasurementFrame from './MeasurementFrame';
import { getPrecisionSettings } from '../utils/getPrecisionSettings';
import DimensionsTable from './DimensionsTable';

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

  // // === Statusberechnung ===
  // const getRowStatus = (dim, value) => {
  //   if (value === '' || value == null || isNaN(value)) return 'neutral';
  //   const v = parseFloat(value);
  //   const lower = dim.nominal - Math.abs(dim.tol_minus);
  //   const upper = dim.nominal + Math.abs(dim.tol_plus);
  //   return v >= lower && v <= upper ? 'ok' : 'fail';
  // };

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
            <DimensionsTable
              dimensions={dimensions}
              values={values}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
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
