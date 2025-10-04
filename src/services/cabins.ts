import { Cabin, RawCabin } from '@/types/cabin';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtiene todas las cabañas desde el backend.
 * @returns {Promise<Cabin[]>} Un arreglo con todas las cabañas.
 */
export async function getAllCabins(): Promise<Cabin[]> {
  try {
    const res = await fetch(`${API_URL}/cabins`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Error al obtener los datos de las cabañas.');
    }

    const rawCabins: RawCabin[] = await res.json();
    const cabins = rawCabins.map((cabin) => {
      try {
        return {
          ...cabin,
          amenities: JSON.parse(cabin.amenities),
          location: JSON.parse(cabin.location),
        };
      } catch (error) {
        return {
          ...cabin,
          amenities: {},
          location: {
            address: 'Ubicación no disponible',
            coordinates: { lat: 0, lng: 0 },
          },
        };
      }
    });
    console.log(cabins);
    return cabins;
  } catch (error) {
    throw new Error('No se pudieron cargar las cabañas.');
  }
}

/**
 * Obtiene todas las cabañas desde el backend.
 * @returns {Promise<Cabin[]>} Un arreglo con todas las cabañas.
 */
export async function getCabinById(id: string): Promise<Cabin> {
  try {
    const res = await fetch(`${API_URL}/cabins/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Error al obtener los datos de la cabaña');
    }

    const rawCabin: RawCabin = await res.json();
    const cabin = {
      ...rawCabin,
      amenities: JSON.parse(rawCabin.amenities),
      location: JSON.parse(rawCabin.location),
    };

    console.log(cabin);
    return cabin;
  } catch (error) {
    throw new Error('No se pudo cargar la cabaña.');
  }
}
