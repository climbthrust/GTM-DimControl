import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import ProductData from '../components/ProductData';
import Dimensions from '../components/Dimensions';

const ProductPage = ({ dimensions, product, measurementTools }) => {
  return (
    <div
      className='flex flex-col w-screen h-screen gap-4 p-4
                bg-gtm-gray-900 text-gtm-text-100 font-sans
                selection:bg-gtm-accent-400 selection:text-gtm-text-900'
    >
      <div className='flex-[1] min-h-0'>
        <ProductData product={product} />
      </div>
      <div className='flex-[3] min-h-0'>
        <Dimensions
          dimensions={dimensions}
          // gotoMeasurement={gotoMeasurement}
          measurementTools={measurementTools}
        />
      </div>
    </div>
  );
};

export default ProductPage;
