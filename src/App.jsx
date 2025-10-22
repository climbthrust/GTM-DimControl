import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import ProductData from './components/ProductData';
import Dimensions from './components/Dimensions';
import SaveReport from './components/SaveReport'; // optional, wenn du später speicherst

export default function App() {
  const [mode, setMode] = useState('product'); // 'product' | 'dimensions' | 'save'
  const [product, setProduct] = useState(null);
  const [dimensions, setDimensions] = useState([]);
  const [measurementTools, setMeasurementTools] = useState([]);

  // --------------------------------------------------

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
        setMode('product');
        return;
      }

      const dims = await invoke('get_dimensions_for_product', {
        productId: prod.id,
      });

      setProduct(prod);
      setDimensions(dims);
      setMode('dimensions');
    } catch (err) {
      console.error('Fehler beim Laden:', err);
      setProduct(null);
      setDimensions([]);
      setMode('product');
    }
  }

  // Daten laden beim Start
  useEffect(() => {
    async function init() {
      await loadProductAndDimensions();
      await loadAllMeasurementTools();
    }
    init();
  }, []);

  // --------------------------------------------------
  // Key Listener auf App-Ebene
  useEffect(() => {
    const handleKeyDown = e => {
      if (mode === 'product' && product) {
        setMode('dimensions');
      } else if (mode === 'dimensions') {
        // Beispiel: Wenn alle gemessen → Mode save
        const allMeasured = dimensions.every(d => d.measured_value != null);
        if (allMeasured) setMode('save');
      } else if (mode === 'save' && e.key === 'Enter') {
        console.log('Speichervorgang ausgelöst');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, product, dimensions]);

  // --------------------------------------------------
  // Layout bleibt statisch — nur Inhalt ändert sich
  return (
    <div className='w-screen h-screen'>
      <div
        className='flex flex-col w-screen h-screen gap-4 p-4
                      bg-gtm-gray-900 text-gtm-text-100 font-sans
                      selection:bg-gtm-accent-400 selection:text-gtm-text-900'
      >
        <div className='flex-none h-64'>
          <ProductData product={product} />
        </div>
        <div className='flex-grow min-h-0'>
          <Dimensions
            dimensions={dimensions}
            measurementTools={measurementTools}
          />
        </div>
        <div className='flex-none'>
          <SaveReport product={product} dimensions={dimensions} />
        </div>
      </div>
    </div>
  );
}
