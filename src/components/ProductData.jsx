import React, { useEffect, useState } from 'react';
import Frame from './Frame';
import { open } from '@tauri-apps/plugin-fs';

export default function ProductData({ product }) {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    if (!product?.image_path) return;

    (async () => {
      try {
        const url = await toObjectUrl(product.image_path);
        setImgUrl(url);
      } catch (err) {
        console.error('Fehler beim Laden des Bildes:', err);
      }
    })(); // ← async IIFE

    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [product?.image_path]);

  return (
    <Frame>
      <div className='flex w-full h-full'>
        <div className='flex-grow'>
          <h1 className='text-3xl'>{product.name}</h1>
          <p>
            <b>Design:</b> {product.part_number}
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

/** Liest Datei über plugin-fs und gibt eine Blob-URL zurück */
async function toObjectUrl(absPath) {
  console.log('🔍 Lade Bild:', absPath);
  const file = await open(absPath, { read: true });
  const stat = await file.stat();
  const buf = new Uint8Array(stat.size);
  await file.read(buf);
  await file.close();

  const lower = absPath.toLowerCase();
  const mime = lower.endsWith('.png')
    ? 'image/png'
    : lower.endsWith('.webp')
    ? 'image/webp'
    : 'image/jpeg';

  const blob = new Blob([buf], { type: mime });
  return URL.createObjectURL(blob);
}
