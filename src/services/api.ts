import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.1.10:3000/api/v1',
});

export function mensajeDeError(e: unknown): string {
  if (axios.isAxiosError(e)) {
    return e.response?.data?.message ?? 'No se pudo conectar con el servidor';
  }
  return 'Ocurrió un error inesperado';
}