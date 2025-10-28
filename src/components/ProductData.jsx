import React, { useState, useEffect } from 'react';
import Frame from './Frame';
import Notes from './Notes';
import GTMButton from './basics/GTMButton';

export default function ProductData({
  product,
  onLoadBySerial,
  highlighted,
  onUnload,
}) {
  const [serial, setSerial] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ------------------------------------------------------------
  // Kein Produkt geladen → Eingabemaske anzeigen
  if (!product) {
    return (
      <Frame highlighted={highlighted}>
        <div className='flex flex-col items-center justify-center w-full h-full gap-4 text-gtm-gray-200'>
          <div className='text-xl font-semibold text-gtm-gray-100'>
            Kein Produkt geladen
          </div>
          <div className='flex gap-2'>
            <input
              type='text'
              placeholder='Seriennummer'
              className='bg-gtm-gray-800 border border-gtm-gray-700 text-gtm-gray-100 rounded px-3 py-2 w-64 focus:outline-none focus:border-gtm-accent-400'
              value={serial}
              onChange={e => setSerial(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onLoadBySerial(serial)}
            />
            <button
              onClick={() => onLoadBySerial(serial)}
              disabled={loading}
              className='px-4 py-2 bg-gtm-accent-500 text-gtm-gray-900 rounded hover:bg-gtm-accent-400 transition'
            >
              {loading ? 'Lädt...' : 'Laden'}
            </button>
          </div>
          {error && <div className='text-gtm-fail text-sm'>{error}</div>}
        </div>
      </Frame>
    );
  }

  // ------------------------------------------------------------
  // Produkt geladen → Produktdetails anzeigen
  const { series, product_type, image_file_name, name, notes } = product;
  const imgUrl =
    BASE_URL && image_file_name && product_type
      ? `${BASE_URL}/product_images/${encodeURIComponent(
          product_type
        )}/${encodeURIComponent(image_file_name)}`
      : null;

  return (
    <Frame highlighted={highlighted}>
      <div className='flex w-full h-full gap-4'>
        {/* Produktinfos */}
        <div className='flex-1 flex flex-col gap-4 justify-between'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='mt-2'>
                <GTMButton
                  icon='delete'
                  title='Produkt entladen'
                  onClick={onUnload}
                />
              </div>
              <h1 className='text-gtm-gray-200 text-6xl'>
                {product.serial_number || '–'}
              </h1>
            </div>
            <div>
              <div className='text-base font-semibold text-gtm-gray-300 rounded-full px-3 py-1 bg-gtm-gray-800'>
                Serie {series || '–'} / {product_type || '–'}
              </div>
            </div>
          </div>
          {notes && <Notes>{notes}</Notes>}
        </div>

        {/* Produktbild */}
        <div className='rounded-sm flex items-center justify-center overflow-hidden h-full w-auto'>
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={name || 'Produktbild'}
              className='max-w-full max-h-full object-contain rounded'
            />
          ) : (
            <div className='h-full rounded-sm border border-gtm-gray-700 w-48 flex items-center justify-center'>
              <p className='text-gtm-gray-500'>Kein Bild</p>
            </div>
          )}
        </div>
      </div>
    </Frame>
  );
}
