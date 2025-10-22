import React, { useState } from 'react';
import Frame from './Frame';
import GTMImage from './GTMImage';
import Notes from './Notes';
import { X } from 'lucide-react';

export default function ProductData({
  product,
  setProduct,
  onLoadBySerial,
  onUnload, // 👈 neu: optionaler Callback zum Aufräumen
  highlighted,
}) {
  const [serial, setSerial] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // const handleLoad = async () => {
  //   if (!serial.trim()) return;
  //   setLoading(true);
  //   setError('');

  //   try {
  //     const res = await fetch(
  //       `${BASE_URL}/api/get-product-by-serial/${encodeURIComponent(
  //         serial.trim()
  //       )}`
  //     );
  //     if (!res.ok) throw new Error('Produkt nicht gefunden');
  //     const data = await res.json();
  //     setProduct(data);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUnload = () => {
    if (confirm('Aktuelles Produkt wirklich entladen?')) {
      setProduct(null);
      if (onUnload) onUnload(); // z. B. Dimensions löschen
    }
  };

  // ------------------------------------------------------------
  // Kein Produkt geladen → Eingabemaske anzeigen
  if (!product) {
    return (
      <Frame highlighted={highlighted}>
        <div className='flex flex-col items-center justify-center w-full h-full gap-4 text-gtm-text-200'>
          <div className='text-xl font-semibold text-gtm-text-100'>
            Kein Produkt geladen
          </div>
          <div className='flex gap-2'>
            <input
              type='text'
              placeholder='Seriennummer'
              className='bg-gtm-gray-800 border border-gtm-gray-700 text-gtm-text-100 rounded px-3 py-2 w-64 focus:outline-none focus:border-gtm-accent-400'
              value={serial}
              onChange={e => setSerial(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onLoadBySerial(serial)}
            />
            <button
              onClick={() => onLoadBySerial(serial)}
              disabled={loading}
              className='px-4 py-2 bg-gtm-accent-500 text-gtm-text-900 rounded hover:bg-gtm-accent-400 transition'
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
      <div className=' flex w-full h-full gap-4'>
        {/* Produktinfos */}
        <div className='flex-1 flex flex-col gap-4 justify-between'>
          <div className='flex gap-4 items-center mb-2 flex-grow'>
            <h1 className='text-gtm-text-200 text-4xl'>
              {product.serial_number || '–'}
            </h1>
            {/* <button onClick={handleUnload}>
                <X className='absolute -right-4 -top-2 bg-gtm-fail-700 w-5 h-5 rounded-full border border-gtm-gray-300' />
              </button> */}

            <h2 className='text-2xl font-semibold text-gtm-text-300 rounded-full px-3 py-1 bg-gtm-gray-800'>
              Serie {series || '–'} / {product_type || '–'}
            </h2>
          </div>
          <Notes>{notes}</Notes>
        </div>

        {/* Produktbild */}
        <GTMImage
          width='w-1/5'
          imgUrl={imgUrl}
          name={name}
          bordered={false}
          align='justify-end'
        />
      </div>
    </Frame>
  );
}
