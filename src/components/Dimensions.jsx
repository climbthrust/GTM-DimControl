import React, { useState } from 'react';
import Frame from './Frame';

const Dimensions = ({ dimensions, basePath }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [values, setValues] = useState({});

  const handleRowClick = id => {
    setSelectedId(id);
  };

  const handleValueChange = (id, value) => {
    setValues(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  // Hilfsfunktion: Anzahl Nachkommastellen robust ermitteln (inkl. 1e-Notation)
  const decimalsOf = n => {
    if (n == null || !isFinite(n)) return 0;
    const s = String(n);
    if (s.includes('e-')) {
      // z.B. 1e-4 => 4 Nachkommastellen
      const [, exp] = s.split('e-');
      return parseInt(exp, 10) || 0;
    }
    const part = s.split('.')[1];
    return part ? part.length : 0;
  };

  // Schrittweite/Precision aus Toleranzen: eine Stelle feiner als die "feinste" Toleranz
  const getStepFromTolerance = (tolPlus, tolMinus) => {
    const dPlus = decimalsOf(Math.abs(tolPlus));
    const dMinus = decimalsOf(Math.abs(tolMinus));
    const decimals = Math.max(dPlus, dMinus) + 1; // <-- Kernregel
    const step = Math.pow(10, -decimals);
    return { step, decimals };
  };

  return (
    <Frame>
      <div className='flex w-full h-full text-gtm-gray-700'>
        <div className='flex-grow overflow-auto'>
          <h2 className='text-xl font-semibold mb-3 text-gtm-gray-700'>
            Messpunkte
          </h2>

          {!dimensions || dimensions.length === 0 ? (
            <p className='text-gtm-gray-700/60'>Keine Messpunkte vorhanden</p>
          ) : (
            <table className='w-full border-collapse text-sm'>
              <thead className='bg-gtm-gray-300 border-b border-gtm-gray-900 sticky top-0'>
                <tr>
                  <th className='text-left p-2 w-12'>ID</th>
                  <th className='text-left p-2'>Bezeichnung</th>
                  <th className='text-right p-2'>Soll</th>
                  <th className='text-right p-2'>+Tol</th>
                  <th className='text-right p-2'>−Tol</th>
                  <th className='text-left p-2'>Einheit</th>
                  <th className='text-right p-2'>Ist</th>
                </tr>
              </thead>
              <tbody>
                {dimensions.map(dim => {
                  const isSelected = dim.id === selectedId;
                  const { step, decimals } = getStepFromTolerance(
                    dim.tol_plus,
                    dim.tol_minus
                  );
                  const currentValue = values[dim.id] ?? '';

                  return (
                    <tr
                      key={dim.id}
                      onClick={() => handleRowClick(dim.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-gtm-accent-100 border-2 border-gtm-accent-600'
                          : 'bg-gtm-gray-100 hover:bg-gtm-gray-200 border-b border-gtm-gray-200'
                      }`}
                    >
                      <td className='p-2'>{dim.id}</td>
                      <td className='p-2'>{dim.name}</td>
                      <td className='p-2 text-right'>
                        {dim.nominal.toFixed(decimals)}
                      </td>
                      <td className='p-2 text-right text-green-700'>
                        +{dim.tol_plus.toFixed(decimals)}
                      </td>
                      <td className='p-2 text-right text-red-700'>
                        −{dim.tol_minus.toFixed(decimals)}
                      </td>
                      <td className='p-2'>{dim.unit}</td>
                      <td className='p-2 text-right'>
                        <input
                          type='number'
                          step={step}
                          inputMode='decimal'
                          className='w-20 px-1 py-0.5 border border-gtm-gray-300 rounded text-right 
                                     focus:outline-none focus:border-gtm-accent-600 
                                     focus:ring-1 focus:ring-gtm-accent-300 text-gtm-gray-700 bg-white'
                          value={currentValue}
                          onChange={e =>
                            handleValueChange(dim.id, e.target.value)
                          }
                          onClick={e => e.stopPropagation()}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {/* rechter Bereich */}
        {/* <div className='w-56 h-auto border border-gtm-gray-300 flex items-center justify-center bg-white'>
          {selectedId ? (
            <p className='text-sm text-gtm-gray-700'>
              Messpunkt #{selectedId} gewählt
            </p>
          ) : (
            <p className='text-sm text-gtm-gray-700/50'>Noch keine Auswahl</p>
          )}
        </div>
        
        <div className='w-56 h-auto border border-gtm-gray-300 flex items-center justify-center bg-white'>
          {selectedId ? (
            <p className='text-sm text-gtm-gray-700'>
              Messpunkt #{selectedId} gewählt
            </p>
          ) : (
            <p className='text-sm text-gtm-gray-700/50'>Noch keine Auswahl</p>
          )}
        </div> */}
      </div>
    </Frame>
  );
};

export default Dimensions;
