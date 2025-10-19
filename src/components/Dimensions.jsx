import React, { useState, useEffect } from 'react';
import Frame from './Frame';
import MeasurementModal from './MeasurementModal';
import GTMImage from './GTMImage';
import { DraftingCompass } from 'lucide-react';
import MeasurementTool from './MeasurementTool';

export default function Dimensions({ dimensions, basePath, measurementTools }) {
  const [selectedId, setSelectedId] = useState(null);
  const [values, setValues] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [selectedTool, setSelectedTool] = useState({});

  const handleDimensionClick = id => {
    setSelectedId(id);
  };

  const handleValueChange = (id, value) =>
    setValues(prev => ({ ...prev, [id]: value }));

  const handleStartMeasurement = () => {
    if (!dimensions?.length) return;
    setCurrentIndex(0);
    setIsModalOpen(true);
  };

  const handleSaveFromModal = (id, value) => {
    setValues(prev => ({ ...prev, [id]: value }));
    if (currentIndex < dimensions.length - 1) setCurrentIndex(p => p + 1);
    else setIsModalOpen(false);
  };

  const handleRepeatMeasurement = id => {
    const index = dimensions.findIndex(d => d.id === id);
    if (index !== -1) {
      setCurrentIndex(index);
      setIsModalOpen(true);
    }
  };

  // Schrittweite aus Toleranzen: eine Stelle feiner als die präzisere Toleranz
  const decimalsOf = n => {
    if (n == null || !isFinite(n)) return 0;
    const s = String(n);
    if (s.includes('e-')) return parseInt(s.split('e-')[1], 10) || 0;
    const part = s.split('.')[1];
    return part ? part.length : 0;
  };

  const getStepFromTolerance = (tolPlus, tolMinus) => {
    const dPlus = decimalsOf(Math.abs(tolPlus));
    const dMinus = decimalsOf(Math.abs(tolMinus));
    const decimals = Math.max(dPlus, dMinus) + 1;
    const step = Math.pow(10, -decimals);
    return { step, decimals };
  };

  const getRowStatus = (dim, value) => {
    if (value === '' || value == null || isNaN(value)) return 'neutral';
    const v = parseFloat(value);
    const lower = dim.nominal - Math.abs(dim.tol_minus);
    const upper = dim.nominal + Math.abs(dim.tol_plus);
    if (v >= lower && v <= upper) return 'ok';
    return 'fail';
  };

  // === Render ===
  return (
    <Frame>
      <div className='flex w-full h-full gap-4'>
        {/* linke Seite: Tabelle */}
        <div className='flex-1 flex flex-col w-full overflow-auto'>
          <div className='flex justify-center items-center mb-4'>
            <button
              onClick={handleStartMeasurement}
              className='bg-gtm-accent-500 hover:bg-gtm-accent-400 text-gtm-text-900 px-6 py-4 rounded-lg text-xl font-medium transition-colors'
            >
              Messung starten
            </button>
          </div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>Messpunkte</h2>
          </div>

          {!dimensions?.length ? (
            <p className='text-gtm-text-400'>Keine Messpunkte vorhanden</p>
          ) : (
            <table className='w-full table-fixed border-collapse text-sm rounded-md'>
              <thead className='bg-gtm-gray-800 border-b border-gtm-gray-700 sticky top-0'>
                <tr className='text-gtm-text-200'>
                  <th className='text-left p-2 w-12'>ID</th>
                  <th className='text-left p-2'>Bezeichnung</th>
                  <th className='text-right p-2 w-24'>Soll</th>
                  <th className='text-right p-2 w-20'>+Tol</th>
                  <th className='text-right p-2 w-20'>−Tol</th>
                  <th className='text-left p-2 w-20'>Einheit</th>
                  <th className='text-right p-2 w-28'>Ist</th>
                  <th className='p-2 w-10'>
                    <div className='flex items-center justify-center'>
                      <DraftingCompass strokeWidth={1.5} size={18} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {dimensions.map(dim => {
                  const { step, decimals } = getStepFromTolerance(
                    dim.tol_plus,
                    dim.tol_minus
                  );
                  const currentValue = values[dim.id] ?? '';
                  const status = getRowStatus(dim, currentValue);

                  // let bgClass = 'bg-gtm-gray-800 hover:bg-gtm-gray-600';
                  // if (status === 'ok')
                  //   bgClass = 'bg-gtm-ok-800/40 hover:bg-gtm-ok-700/40';
                  // if (status === 'fail')
                  //   bgClass = 'bg-gtm-fail-600/40 hover:bg-gtm-fail-400/40';
                  // if (dim.id === selectedId)
                  //   bgClass = 'bg-gtm-gray-700 hover:bg-gtm-gray-600';

                  return (
                    <tr
                      key={dim.id}
                      className={`cursor-pointer transition-colors border-b border-gtm-gray-700 ${
                        dim.id === selectedId
                          ? 'bg-gtm-gray-700'
                          : 'bg-gtm-gray-800'
                      }  hover:bg-gtm-gray-600`}
                      onClick={() => handleDimensionClick(dim.id)}
                    >
                      <td className='p-2'>{dim.id}</td>
                      <td className='p-2'>{dim.name}</td>
                      <td className='p-2 text-right'>
                        {dim.nominal.toFixed(decimals)}
                      </td>
                      <td className='p-2 text-right'>
                        +{dim.tol_plus.toFixed(decimals)}
                      </td>
                      <td className='p-2 text-right'>
                        −{dim.tol_minus.toFixed(decimals)}
                      </td>
                      <td className='p-2'>{dim.unit}</td>
                      <td className='p-2 text-right'>
                        <input
                          type='number'
                          step={step}
                          inputMode='decimal'
                          className={`w-20 px-1 py-0.5 border ${
                            status === 'ok'
                              ? 'border-gtm-ok-600'
                              : 'border-gtm-gray-700'
                          }  rounded text-right
                                     focus:outline-none focus:border-gtm-accent-500
                                     focus:ring-1 focus:ring-gtm-accent-400
                                     bg-gtm-gray-900`}
                          value={currentValue}
                          onChange={e =>
                            handleValueChange(dim.id, e.target.value)
                          }
                          onClick={e => e.stopPropagation()}
                        />
                      </td>
                      <td className='p-2 w-10 ml-6'>
                        <div className='flex items-center justify-center'>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleRepeatMeasurement(dim.id);
                            }}
                            className='p-1 rounded-md hover:bg-gtm-gray-700 transition-colors'
                            title='Einzelmessung starten'
                          >
                            <DraftingCompass
                              size={18}
                              className='text-gtm-accent-400'
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* rechte Seite: Info */}
        <GTMImage width='w-1/3' imgUrl='' name='' />
        {/* <MeasurementTool tool={selectedTool} /> */}
      </div>

      {/* Vollbild-Messmodal */}
      <MeasurementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dimensions={dimensions}
        currentIndex={currentIndex}
        onSave={handleSaveFromModal}
        measurementTools={measurementTools}
      />
    </Frame>
  );
}
