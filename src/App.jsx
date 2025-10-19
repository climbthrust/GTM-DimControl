import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import ProductData from './components/ProductData';
import Dimensions from './components/Dimensions';

export default function App() {
  const [product, setProduct] = useState(null);
  const [dimensions, setDimensions] = useState([]);
  const [measurementTools, setMeasurementTools] = useState([]);

  useEffect(() => {
    loadProductAndDimensions();
    loadAllMeasurementTools();
  }, []);

  async function loadAllMeasurementTools() {
    try {
      const tools = await invoke('load_all_measurement_tools');
      setMeasurementTools(tools);
      console.log('Tools geladen:', tools);
    } catch (err) {
      console.error('Fehler beim Laden der Measurement Tools:', err);
    }
  }

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

      setProduct(prod);
      setDimensions(dims);
    } catch (err) {
      console.error('Fehler beim Laden:', err);
      setProduct(null);
      setDimensions([]);
    }
  }

  return (
    <div
      className='flex flex-col w-screen h-screen gap-4
                bg-gtm-gray-900 text-gtm-text-100 font-sans
                selection:bg-gtm-accent-400 selection:text-gtm-text-900'
    >
      <div className='flex-[1] min-h-0'>
        <ProductData product={product} />
      </div>
      <div className='flex-[2] min-h-0'>
        <Dimensions
          dimensions={dimensions}
          measurementTools={measurementTools}
        />
      </div>
    </div>
  );
}
