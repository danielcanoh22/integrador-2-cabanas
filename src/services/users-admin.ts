import { apiClient } from '@/lib/apiClient';
import { User } from '@/types/user';

/**
 * Obtiene todos los usuarios (admin)
 */
export async function getAllUsers(): Promise<User[]> {
  return apiClient('/admin/users', {
    method: 'GET',
  });
}

/**
 * Actualiza un usuario (admin)
 */
export async function updateUser(user: User): Promise<void> {
  await apiClient(`/admin/users/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  });
}
