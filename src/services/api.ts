import axios from 'axios';
import { API_URL } from '../constants/config';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

let alSesionExpirar: (() => void) | null = null;

export function setAlSesionExpirar(callback: (() => void) | null): void {
  alSesionExpirar = callback;
}

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      api.defaults.headers.common.Authorization
    ) {
      alSesionExpirar?.();
    }
    return Promise.reject(error);
  },
);

export function setAuthToken(token: string | null): void {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function mensajeDeError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const mensaje = e.response?.data?.message;

    if (typeof mensaje === 'string') {
      return mensaje;
    }

    if (e.code === 'ECONNABORTED') {
      return 'El servidor tardó demasiado en responder. Inténtalo de nuevo.';
    }

    return 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
  }

  return 'Ocurrió un error inesperado';
}