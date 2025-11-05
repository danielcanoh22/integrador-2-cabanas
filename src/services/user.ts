import { User } from '@/types/user';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getUserById(userId: number): Promise<User> {
  const token = Cookies.get('accessToken');
  if (!token) throw new Error('No estás autenticado.');

  const endpoint = `${API_URL}/users/profile`;

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'X-User-Id': userId.toString(),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('No se pudo obtener la información del usuario.');
    }

    return await res.json();
  } catch (error) {
    console.error(`Error al obtener el usuario ${userId}:`, error);
    throw error;
  }
}
