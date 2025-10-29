import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import ProductData from './components/ProductData';
import Dimensions from './components/Dimensions';
import SaveReport from './components/SaveReport';
import ToolModalProvider from './contexts/ToolModalProvider';

export default function App() {
  const [mode, setMode] = useState('product'); // 'product' | 'dimensions' | 'save'
  const [product, setProduct] = useState(null);
  const [dimensions, setDimensions] = useState([]);
  const [measurementTools, setMeasurementTools] = useState([]);

  // --------------------------------------------------
  async function loadProductBySerial(serialNumber) {
    try {
      const prod = await invoke('get_product_by_serial', { serialNumber });
      if (!prod) throw new Error('Kein Produkt zur Seriennummer gefunden');

      const dims = await invoke('get_dimensions_for_product', {
        productId: prod.id,
      });

      setProduct(prod);
      setDimensions(dims);
      setMode('dimensions');
    } catch (err) {
      console.error('Fehler beim Laden per Seriennummer:', err);
      setProduct(null);
      setDimensions([]);
      setMode('product');
    }
  }

  async function loadAllMeasurementTools() {
    try {
      const tools = await invoke('load_all_measurement_tools');
      setMeasurementTools(tools);
    } catch (err) {
      console.error('Fehler beim Laden der Measurement Tools:', err);
    }
  }

  // --------------------------------------------------
  function handleUnloadProduct() {
    setProduct(null);
    setDimensions([]);
    setMode('product');
  }

  // --------------------------------------------------
  // Wird vom ToolModalContext aufgerufen, wenn in der DB das Werkzeug geändert wurde
  function handleToolChanged(dimensionId, toolId) {
    setDimensions(prev =>
      prev.map(d =>
        d.id === dimensionId ? { ...d, measurement_tool_id: toolId } : d
      )
    );
  }

  // --------------------------------------------------
  useEffect(() => {
    loadAllMeasurementTools();
  }, []);

  // --------------------------------------------------
  return (
    <div className='w-[1264px] min-w-[1264px] h-full overflow-auto'>
      <div
        className='flex flex-col w-full h-full gap-2 p-4
                   bg-gtm-gray-900 text-gtm-gray-100 font-sans
                   selection:bg-gtm-accent-400 selection:text-gtm-gray-900'
      >
        {/* Produktdaten */}
        <div className='flex-none h-48'>
          <ProductData
            product={product}
            onLoadBySerial={loadProductBySerial}
            onUnload={handleUnloadProduct}
            highlighted={mode === 'product'}
          />
        </div>

        {/* Messungen */}
        <div className='flex-grow min-h-0'>
          <ToolModalProvider
            measurementTools={measurementTools}
            onToolChanged={handleToolChanged}
          >
            <Dimensions
              dimensions={dimensions}
              measurementTools={measurementTools}
              highlighted={mode === 'dimensions'}
              onAllMeasured={() => setMode('save')}
            />
          </ToolModalProvider>
        </div>

        {/* Bericht */}
        <div className='flex-none'>
          <SaveReport
            product={product}
            dimensions={dimensions}
            highlighted={mode === 'save'}
            mode={mode}
          />
        </div>
      </div>
    </div>
  );
}
