import { invoke } from '@tauri-apps/api/core';

// export async function getProducts() {
//   console.log('getting Products');
//   return await invoke('get_products');
// }

export async function getFirstProduct() {
  return await invoke('get_first_product');
}

// export async function addProduct(name, price) {
//   return await invoke('add_product', { name, price });
// }
