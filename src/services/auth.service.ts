import { api } from './api';

export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
};

type RespuestaLogin = {
  token: string;
  usuario: Usuario;
};

export async function loginRequest(email: string, password: string): Promise<RespuestaLogin> {
  const respuesta = await api.post<RespuestaLogin>('/auth/login', { email, password });
  return respuesta.data;
}