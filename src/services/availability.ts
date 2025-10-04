import { AvailabilityMap, AvailabilityRecord } from '@/types/availability';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtiene la disponibilidad de fechas para una cabaña en un mes y año específicos.
 *
 * @param year El año para la consulta.
 * @param month El mes para la consulta (1 para Enero, 12 para Diciembre).
 * @returns {Promise<AvailabilityMap>} Un objeto donde cada clave es una fecha
 * ('YYYY-MM-DD') y su valor es un booleano indicando la disponibilidad.
 */
export async function getMonthlyAvailability(
  cabinId: number,
  year: number,
  month: number
): Promise<AvailabilityMap[]> {
  const endpoint = `${API_URL}/availability/cabin/${cabinId}/calendar?year=${year}&month=${month}`;

  try {
    const res = await fetch(endpoint, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Error al obtener las fechas disponibles.');
    }

    const availabilityData: AvailabilityMap[] = await res.json();

    console.log(availabilityData);

    return availabilityData;
  } catch (error) {
    throw new Error('Error al obtener las fechas disponibles.');
  }
}
