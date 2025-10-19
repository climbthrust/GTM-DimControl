import React from 'react';
import Frame from './Frame';
import GTMImage from './GTMImage';
import Notes from './Notes';

export default function ProductData({ product }) {
  if (!product) {
    return (
      <Frame>
        <div className='flex items-center justify-center w-full h-full text-gtm-text-400'>
          Kein Produkt geladen
        </div>
      </Frame>
    );
  }

  const { series, product_type, image_file_name, name, notes } = product;

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const imgUrl =
    BASE_URL && image_file_name && product_type
      ? `${BASE_URL}/product_images/${encodeURIComponent(
          product_type
        )}/${encodeURIComponent(image_file_name)}`
      : null;

  return (
    <Frame>
      <div className='flex w-full h-full gap-4'>
        {/* linke Seite: Text */}
        <div className='flex-1 flex flex-col gap-4 justify-between'>
          <div className='h-grow'>
            <h1 className='text-2xl font-semibold mb-2 text-gtm-text-100'>
              {product_type}
            </h1>
            <p className='text-gtm-text-200'>
              <b>Serie:</b> {series || '–'}
            </p>
            <p className='text-gtm-text-200'>
              <b>Teile-Nummer:</b> 12345678
            </p>
          </div>
          <Notes notes={notes} />
        </div>

        <GTMImage width='w-1/3' imgUrl={imgUrl} name={name} bordered={false} />
      </div>
    </Frame>
  );
}
