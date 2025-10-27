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
