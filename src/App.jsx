import React, { useEffect, useState } from 'react';
import { getFirstProduct } from './api/backend';
import ProductData from './components/ProductData';

export default function App() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const p = await getFirstProduct();
    console.log('Gescannter Datensatz:', p);
    setProduct(p);
  }

  if (!product) return <div>Lade Produkt...</div>;

  return (
    <div className='p-4 grid-rows-2 gap-4 w-screen h-screen'>
      <ProductData product={product} />
    </div>
  );
}
