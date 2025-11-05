import { apiClient } from '@/lib/apiClient';
import { ApiCabinResponse, Cabin, CabinPayload } from '@/types/cabin';

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

export async function createCabin(cabinData: CabinPayload): Promise<Cabin> {
  return apiClient('/admin/cabins', {
    method: 'POST',
    body: JSON.stringify(cabinData),
  });
}

export async function updateCabin(
  id: number,
  cabinData: CabinPayload
): Promise<Cabin> {
  return apiClient(`/admin/cabins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cabinData),
  });
}

export async function deleteCabin(id: number): Promise<void> {
  return apiClient(`/admin/cabins/${id}`, {
    method: 'DELETE',
  });
}
