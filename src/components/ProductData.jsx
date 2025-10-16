import React from 'react';
import Frame from './Frame';

export default function ProductData({ product, basePath }) {
  // Falls kein Produkt vorhanden ist → leeren Frame anzeigen

  console.log(basePath);
  if (!product) {
    return (
      <Frame>
        <div className='flex items-center justify-center w-full h-full text-gray-500'>
          Kein Produkt geladen
        </div>
      </Frame>
    );
  }

  const { series, product_type, image_file_name, name } = product;

  const imgUrl =
    basePath && image_file_name
      ? `${basePath}/${encodeURIComponent(image_file_name)}`
      : null;

  return (
    <Frame>
      <div className='flex w-full h-full items-start justify-between'>
        <div className='flex-grow'>
          <h1 className='text-3xl font-semibold mb-2'>{product_type}</h1>
          <p>
            <b>Serie:</b> {series || '–'}
          </p>
          <p>
            <b>Teile-Nummer:</b> 12345678
          </p>
        </div>

        <div className='w-56 h-auto border border-gtm-gray-300 flex items-center justify-center bg-white'>
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={name || 'Produktbild'}
              className='max-w-full h-auto object-contain'
            />
          ) : (
            <p className='text-gray-500'>Kein Bild</p>
          )}
        </div>
      </div>
    </Frame>
  );
}
