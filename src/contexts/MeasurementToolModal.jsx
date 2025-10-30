import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import GTMButton from '../components/basics/GTMButton';
import { X, SquareCheckBig, Square, Bluetooth } from 'lucide-react';

export default function MeasurementToolModal({
  tools,
  dimension,
  onClose,
  onUpdated,
}) {
  const [selectedToolId, setSelectedToolId] = useState(
    dimension?.measurement_tool_id || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!dimension) return null;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleConfirm = async () => {
    if (
      selectedToolId === null ||
      selectedToolId === dimension.measurement_tool_id
    )
      return onClose(); // nichts geändert

    try {
      setLoading(true);
      setError(null);

      await invoke('update_dimension_tool', {
        dimensionId: dimension.id,
        toolId: selectedToolId,
      });

      onUpdated?.(dimension.id, selectedToolId);
      onClose();
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Messwerkzeugs:', err);
      setError('Fehler beim Speichern in der Datenbank.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 bg-black/70 flex items-center justify-center'>
      <div className='bg-gtm-gray-900 border border-gtm-gray-700 rounded-lg shadow-lg w-[1024px] max-h-[80vh] overflow-y-auto p-6 relative'>
        <div className='right-4 top-4 absolute text-gtm-gray-300 cursor-pointer hover:text-gtm-accent-500'>
          <X strokeWidth={1.5} size={32} onClick={onClose} />
        </div>
        <h2 className='text-xl font-semibold text-gtm-accent-400 mb-2'>
          Messwerkzeug wählen
        </h2>
        <p className='mb-4 text-gtm-gray-300 italic'>{dimension.name}</p>

        {error && <div className='text-gtm-fail-500 text-sm mb-3'>{error}</div>}

        {/* Tabelle */}
        <table className='w-full text-left border-collapse'>
          <thead className='text-gtm-gray-400 text-sm border-b border-gtm-gray-700'>
            <tr>
              <th className='py-2 px-3'>
                <Square strokeWidth={1.5} size={16} />
              </th>
              <th className='py-2 px-3'>Bild</th>
              <th className='py-2 px-3'>Name</th>
              <th className='py-2 px-3'>Typ</th>
              <th className='py-2 px-3'>
                <Bluetooth strokeWidth={1.5} size={16} />
              </th>
              <th className='py-2 px-3'>Kalibriert am</th>
              <th className='py-2 px-3'>Gültig bis</th>
              <th className='py-2 px-3'>Notizen</th>
            </tr>
          </thead>
          <tbody>
            {tools.map(t => {
              const imgUrl =
                BASE_URL && t.image_file_name
                  ? `${BASE_URL}/tools_images/${encodeURIComponent(
                      t.image_file_name
                    )}`
                  : null;

              const isSelected = t.id === selectedToolId;

              return (
                <tr
                  key={t.id}
                  className='cursor-pointer transition-colors  border-b border-gtm-gray-700 hover:bg-gtm-gray-800'
                  onClick={() => setSelectedToolId(t.id)}
                >
                  <td className='py-2 px-3'>
                    {isSelected ? (
                      <SquareCheckBig
                        strokeWidth={1.5}
                        size={16}
                        className='text-gtm-ok-400'
                      />
                    ) : (
                      <Square className='text-gtm-gray-300' size={16} />
                    )}
                  </td>
                  <td className='py-2 px-3'>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={t.name}
                        className='w-12 h-12 object-contain rounded'
                      />
                    ) : (
                      <div className='w-12 h-12 bg-gtm-gray-700 rounded flex items-center justify-center text-xs text-gtm-gray-500'>
                        Kein Bild
                      </div>
                    )}
                  </td>
                  <td className='py-2 px-3'>{t.name}</td>
                  <td className='py-2 px-3'>{t.device_type}</td>
                  <td className='py-2 px-3 text-sm text-gtm-gray-400'>
                    <Bluetooth
                      strokeWidth={1.5}
                      size={16}
                      className='text-gtm-blue-600'
                    />
                  </td>
                  <td className='py-2 px-3 text-sm text-gtm-gray-400'>
                    {t.calibration_date || '–'}
                  </td>
                  <td className='py-2 px-3 text-sm text-gtm-gray-400'>
                    {t.valid_until || '–'}
                  </td>
                  <td className='py-2 px-3 text-sm text-gtm-gray-400'>
                    {t.notes || ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Buttons unten */}
        <div className='flex justify-between mt-6 gap-3'>
          <GTMButton
            icon='unlink'
            title='Abbrechen'
            onClick={onClose}
            disabled={loading}
          />
          <GTMButton
            icon='ok'
            title='Übernehmen'
            active={true}
            disabled={loading || selectedToolId === null}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
}
