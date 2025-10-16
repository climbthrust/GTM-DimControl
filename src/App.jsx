import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import ProductData from './components/ProductData';
import Dimensions from './components/Dimensions';

export default function App() {
  const [product, setProduct] = useState(null);
  const [dimensions, setDimensions] = useState([]);
  const [basePath, setBasePath] = useState('');

  useEffect(() => {
    loadProductAndDimensions();
  }, []);

  async function loadProductAndDimensions(productId) {
    try {
      const prod = productId
        ? await invoke('get_product_by_id', { productId })
        : await invoke('get_first_product');

      if (!prod) {
        console.error('Kein Produkt erhalten');
        setProduct(null);
        setDimensions([]);
        setBasePath('');
        return;
      }

      const dims = await invoke('get_dimensions_for_product', {
        productId: prod.id,
      });

      const BASE_URL = import.meta.env.VITE_BASE_IMAGE_URL;

      // Sicherstellen, dass product_type existiert
      const safeType = prod.product_type
        ? encodeURIComponent(prod.product_type)
        : '';
      const path = BASE_URL && safeType ? `${BASE_URL}/${safeType}` : '';

      setProduct(prod);
      setDimensions(dims);
      setBasePath(path);
    } catch (err) {
      console.error('Fehler beim Laden:', err);
      setProduct(null);
      setDimensions([]);
      setBasePath('');
    }
  }

  return (
    <div className='p-4 grid grid-rows-2 gap-4 w-screen h-screen'>
      <ProductData product={product} basePath={basePath} />
      <Dimensions dimensions={dimensions} basePath={basePath} />
    </div>
  );
}
