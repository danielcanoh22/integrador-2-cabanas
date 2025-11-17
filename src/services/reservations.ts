import { apiClient } from '@/lib/apiClient';
import {
  BasicReservation,
  PageResponse,
  CreateReservationRequest,
  UpdateReservationStatusRequest,
} from '@/types/reservation';

export async function getAllReservations(
  page: number,
  size: number
): Promise<PageResponse<BasicReservation>> {
  const endpoint = `/admin/reservations?page=${page}&size=${size}`;

  return apiClient(endpoint, { method: 'GET' });
}

/**
 * Crea una nueva reserva
 */
export async function createReservation(
  data: CreateReservationRequest
): Promise<BasicReservation> {
  return await apiClient('/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Actualiza el estado de una reserva (admin)
 */
export async function updateReservationStatus(
  id: number,
  data: UpdateReservationStatusRequest
): Promise<void> {
  await apiClient(`/admin/reservations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Cancela/elimina una reserva
 */
export async function deleteReservation(id: number): Promise<void> {
  await apiClient(`/reservations/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Obtiene las reservas del usuario autenticado
 */
export async function getUserReservations(): Promise<BasicReservation[]> {
  return await apiClient('/reservations');
}
