export type RootStackParamList = {
  Catalogo: undefined;
  DetalleProducto: { productoId: number };
  Carrito: undefined;
  Checkout: undefined;
  PedidoConfirmado: { pedidoId: number; total: number };
  AdminLogin: undefined;
  PanelAdmin: undefined;
};