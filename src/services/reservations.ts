import { apiClient } from '@/lib/apiClient';
import { BasicReservation, PageResponse } from '@/types/reservation';

export async function getAllReservations(
  page: number,
  size: number
): Promise<PageResponse<BasicReservation>> {
  const endpoint = `/admin/reservations?page=${page}&size=${size}`;

  return apiClient(endpoint, { method: 'GET' });
}
