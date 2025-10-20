import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import ProductPage from './pages/ProductPage';

export default function App() {
  // const [page, setPage] = useState('product');
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

  // const goToMeasurement = () => setPage('measurement');
  // const goToProduct = () => setPage('product');

  // if (page === 'measurement') {
  //   return (
  //     <MeasurementPage
  //       dimensions={dimensions}
  //       setDimensions={setDimensions}
  //       measurementTools={measurementTools}
  //       onBack={goToProduct}
  //     />
  //   );
  // }

  return (
    <ProductPage
      product={product}
      dimensions={dimensions}
      measurementTools={measurementTools}
      // gotoMeasurement={goToMeasurement}
    />
  );
}
