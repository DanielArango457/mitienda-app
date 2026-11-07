import { api } from './api';

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  imagen: string | null;
};

export type ProductoNuevo = Omit<Producto, 'id' | 'imagen'> & {
  imagen?: string | null;
};

export async function getProductos(): Promise<Producto[]> {
  const respuesta = await api.get<Producto[]>('/productos');
  return respuesta.data;
}

export async function getProductoPorId(id: number): Promise<Producto> {
  const respuesta = await api.get<Producto>(`/productos/${id}`);
  return respuesta.data;
}

export async function crearProducto(datos: ProductoNuevo): Promise<Producto> {
  const respuesta = await api.post<Producto>('/productos', datos);
  return respuesta.data;
}

export async function actualizarProducto(
  id: number,
  datos: Partial<ProductoNuevo>,
): Promise<Producto> {
  const respuesta = await api.put<Producto>(`/productos/${id}`, datos);
  return respuesta.data;
}

export async function eliminarProducto(id: number): Promise<void> {
  await api.delete(`/productos/${id}`);
}