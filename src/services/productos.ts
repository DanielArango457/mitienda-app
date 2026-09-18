import { api } from './api';

export type Producto = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
};

export async function getProductos(): Promise<Producto[]> {
  const response = await api.get('/products');
  return response.data;
}