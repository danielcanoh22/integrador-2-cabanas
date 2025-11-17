import { apiClient } from '@/lib/apiClient';
import { User, ChangePasswordRequest } from '@/types/user';

/**
 * Obtiene el perfil del usuario autenticado
 */
export async function getUserProfile(): Promise<User> {
  return await apiClient('/users/profile');
}

/**
 * Cambia la contraseña del usuario autenticado
 */
export async function changePassword(
  data: ChangePasswordRequest
): Promise<void> {
  await apiClient('/users/change-password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
