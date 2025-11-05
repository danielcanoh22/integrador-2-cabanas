import Cookies from 'js-cookie';
import { LoginCredentials, LoginResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Autentica a un usuario y devuelve los tokens de acceso.
 * @param credentials - Objeto con documentNumber y password.
 * @returns {Promise<LoginResponse>} Objeto con accessToken y refreshToken.
 */
export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const endpoint = `${API_URL}/auth/login`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || 'Credenciales incorrectas o usuario no encontrado.'
      );
    }

    const data: LoginResponse = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function refreshToken(): Promise<string> {
  const refreshToken = Cookies.get('refreshToken');
  if (!refreshToken) {
    throw new Error('No se encontró un refreshToken');
  }

  const endpoint = `${API_URL}/auth/refresh`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error('Sesión inválida o expirada.');
  }

  const { accessToken } = await res.json();
  return accessToken;
}

// Registro de nuevos usuarios
export type RegisterPayload = {
  documentNumber: string;
  email: string;
  name: string;
  phone: string; // formato +57-300-999-9999
  pin: string; // 4 dígitos
  role: 'PROFESSOR' | 'RETIREE';
};

export type RegisterResponse = unknown;

export async function register(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const endpoint = `${API_URL}/auth/register`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = 'No se pudo completar el registro.';
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {}
    throw new Error(message);
  }

  try {
    return await res.json();
  } catch {
    return {} as RegisterResponse;
  }
}
