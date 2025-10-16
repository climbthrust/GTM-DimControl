import React from 'react';
import Frame from './Frame';

export default function ProductData({ product }) {
  const BASE_URL = import.meta.env.DEV
    ? 'http://localhost:8080/product_images'
    : 'http://gtm-fileserver/product_images';

  // Serie (zukünftig: product.series) – bis dahin Fallback auf part_number
  const series = product?.series;
  const product_type = product?.product_type;

  // Dateiname kommt aus image_file_name
  const imgUrl =
    series && product?.image_file_name
      ? `${BASE_URL}/${encodeURIComponent(product_type)}/${encodeURIComponent(
          product.image_file_name
        )}`
      : null;

  console.log(imgUrl);

  return (
    <Frame>
      <div className='flex w-full h-full'>
        <div className='flex-grow'>
          <h1 className='text-3xl'>{product.type}</h1>
          <p>
            <b>Serie:</b> {product.series}
          </p>
          <p>
            <b>Teile-Nummer:</b> 12345678
          </p>
        </div>

        <div className='w-56 h-auto border border-gtm-gray-300 flex items-center justify-center'>
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={product.name}
              className='max-w-full h-auto'
            />
          ) : (
            <p>Kein Bild</p>
          )}
        </div>
      </div>
    </Frame>
  );
}
