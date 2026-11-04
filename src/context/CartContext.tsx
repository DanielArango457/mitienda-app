import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Producto } from '../services/productos';

export type ItemCarrito = {
  productoId: number;
  nombre: string;
  precio: number;
  imagen: string | null;
  stock: number;
  cantidad: number;
};

type ResultadoCarrito = {
  ok: boolean;
  mensaje?: string;
};

type CartContextType = {
  items: ItemCarrito[];
  totalItems: number;
  total: number;
  agregar: (producto: Producto, cantidad?: number) => ResultadoCarrito;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  quitar: (productoId: number) => void;
  vaciar: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'mitienda_carrito';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    async function cargarCarrito() {
      try {
        const guardado = await AsyncStorage.getItem(CART_KEY);

        if (guardado) {
          setItems(JSON.parse(guardado) as ItemCarrito[]);
        }
      } catch {
        setItems([]);
      } finally {
        setCargado(true);
      }
    }

    cargarCarrito();
  }, []);

  useEffect(() => {
    if (cargado) {
      AsyncStorage.setItem(CART_KEY, JSON.stringify(items)).catch(() => {});
    }
  }, [items, cargado]);

  const agregar = (producto: Producto, cantidad: number = 1): ResultadoCarrito => {
    if (producto.stock <= 0) {
      return { ok: false, mensaje: 'Este producto está agotado.' };
    }

    const existente = items.find((item) => item.productoId === producto.id);
    const nuevaCantidad = (existente?.cantidad ?? 0) + cantidad;

    if (nuevaCantidad > producto.stock) {
      return {
        ok: false,
        mensaje: `Solo quedan ${producto.stock} unidades de este producto.`,
      };
    }

    const itemActualizado: ItemCarrito = {
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      stock: producto.stock,
      cantidad: nuevaCantidad,
    };

    if (existente) {
      setItems(items.map((item) => (item.productoId === producto.id ? itemActualizado : item)));
    } else {
      setItems([...items, itemActualizado]);
    }

    return { ok: true };
  };

  const quitar = (productoId: number) => {
    setItems(items.filter((item) => item.productoId !== productoId));
  };

  const cambiarCantidad = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      quitar(productoId);
      return;
    }

    setItems(
      items.map((item) =>
        item.productoId === productoId
          ? { ...item, cantidad: Math.min(cantidad, item.stock) }
          : item,
      ),
    );
  };

  const vaciar = () => {
    setItems([]);
  };

  const totalItems = items.reduce((suma, item) => suma + item.cantidad, 0);
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, total, agregar, cambiarCantidad, quitar, vaciar }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }

  return context;
}