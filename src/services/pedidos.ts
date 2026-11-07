import { api } from './api';

export type ItemPedido = {
  productoId: number;
  cantidad: number;
};

export type PedidoNuevo = {
  cliente: string;
  telefono: string;
  items: ItemPedido[];
};

export type PedidoCreado = {
  id: number;
  total: number;
};

export type PedidoItemDetalle = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

export type PedidoResumen = {
  id: number;
  cliente: string;
  telefono: string;
  total: number;
  creadoEn: string;
  items?: PedidoItemDetalle[];
};

export async function crearPedido(pedido: PedidoNuevo): Promise<PedidoCreado> {
  const respuesta = await api.post<PedidoCreado>('/pedidos', pedido);
  return respuesta.data;
}

export async function getPedidos(): Promise<PedidoResumen[]> {
  const respuesta = await api.get<PedidoResumen[]>('/pedidos');
  return respuesta.data;
}