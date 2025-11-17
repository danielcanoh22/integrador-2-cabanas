import { apiClient } from '@/lib/apiClient';
import {
  ApiCabinResponse,
  Cabin,
  CabinPayload,
  UpdateCabinStatusRequest,
} from '@/types/cabin';

/**
 * Obtiene todas las cabañas (admin)
 */
export async function getAllAdminCabins(): Promise<Cabin[]> {
  const rawCabins: ApiCabinResponse[] = await apiClient('/admin/cabins', {
    method: 'GET',
  });

  return rawCabins.map((cabin) => ({
    ...cabin,
    amenities: JSON.parse(cabin.amenities),
    location: JSON.parse(cabin.location),
  }));
}

/**
 * Obtiene una cabaña por ID
 */
export async function getCabinByIdAdmin(id: number): Promise<Cabin> {
  const cabin: ApiCabinResponse = await apiClient(`/admin/cabins/${id}`, {
    method: 'GET',
  });

  return {
    ...cabin,
    amenities: JSON.parse(cabin.amenities),
    location: JSON.parse(cabin.location),
  };
}

/**
 * Crea una cabaña
 */
export async function createCabin(cabinData: CabinPayload): Promise<Cabin> {
  return apiClient('/admin/cabins', {
    method: 'POST',
    body: JSON.stringify(cabinData),
  });
}

/**
 * Actualiza una cabaña
 */
export async function updateCabin(
  id: number,
  cabinData: CabinPayload
): Promise<Cabin> {
  return apiClient(`/admin/cabins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cabinData),
  });
}

/**
 * Elimina una cabaña
 */
export async function deleteCabin(id: number): Promise<void> {
  return apiClient(`/admin/cabins/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Actualiza el estado (activo/inactivo) de una cabaña
 */
export async function updateCabinStatus(
  id: number,
  data: UpdateCabinStatusRequest
): Promise<void> {
  await apiClient(`/admin/cabins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
