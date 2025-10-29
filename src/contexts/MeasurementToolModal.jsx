import React from 'react';

export default function MeasurementToolModal({
  tools,
  dimension,
  onSelect,
  onClose,
}) {
  if (!dimension) return null;

  return (
    <div className='fixed inset-0 z-50 bg-black/70 flex items-center justify-center'>
      <div className='bg-gtm-gray-800 rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto p-6'>
        <h2 className='text-xl font-semibold text-gtm-accent-400 mb-2'>
          Messwerkzeug wählen
        </h2>
        <p className='mb-4 text-gtm-gray-300 italic'>{dimension.name}</p>

        <ul className='divide-y divide-gtm-gray-700'>
          {tools.map(t => (
            <li
              key={t.id}
              className={`p-3 cursor-pointer transition-colors ${
                t.id === dimension.measurement_tool_id
                  ? 'bg-gtm-accent-600 text-gtm-gray-900 font-bold'
                  : 'text-gtm-gray-300 hover:bg-gtm-gray-700'
              }`}
              onClick={() => onSelect(t.id)}
            >
              {t.name}
            </li>
          ))}
        </ul>

        <div className='flex justify-end mt-6'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gtm-gray-700 hover:bg-gtm-gray-600 rounded'
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
