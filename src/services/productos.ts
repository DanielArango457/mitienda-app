import { api } from './api';

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
};

export type ProductoNuevo = Omit<Producto, 'id'>;

export async function getProductos(): Promise<Producto[]> {
  const response = await api.get('/productos');
  return response.data;
}

export async function getProductoPorId(id: number): Promise<Producto> {
  const response = await api.get(`/productos/${id}`);
  return response.data;
}

export async function crearProducto(data: ProductoNuevo): Promise<Producto> {
  const response = await api.post('/productos', data);
  return response.data;
}

export async function actualizarProducto(
  id: number,
  data: Partial<ProductoNuevo>,
): Promise<Producto> {
  const response = await api.put(`/productos/${id}`, data);
  return response.data;
}

export async function eliminarProducto(id: number): Promise<void> {
  await api.delete(`/productos/${id}`);
}