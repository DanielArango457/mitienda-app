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

export async function crearPedido(pedido: PedidoNuevo): Promise<PedidoCreado> {
  const respuesta = await api.post<PedidoCreado>('/pedidos', pedido);
  return respuesta.data;
}