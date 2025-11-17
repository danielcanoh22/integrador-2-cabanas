import { useQuery } from '@tanstack/react-query';
import { getAllReservations } from '@/services/reservations';
import { getUserProfile } from '@/services/users';
import { getCabinById } from '@/services/cabins';
import { BasicReservation, EnrichedReservation } from '@/types/reservation';
import { reservationKeys } from './useReservations';

/**
 * Hook para obtener reservas enriquecidas con datos de usuario y cabaña
 */
export const useEnrichedReservations = (page = 0, size = 10) => {
  return useQuery({
    queryKey: [...reservationKeys.admin(page, size), 'enriched'],
    queryFn: async (): Promise<EnrichedReservation[]> => {
      const response = await getAllReservations(page, size);
      const basicReservations: BasicReservation[] = response.items;

      if (basicReservations.length === 0) {
        return [];
      }

      const enrichedReservations = await Promise.all(
        basicReservations.map(async (res) => {
          try {
            const [user, cabin] = await Promise.all([
              getUserProfile(),
              getCabinById(String(res.cabinId)).catch(() => ({
                id: res.cabinId,
                name: `Cabaña #${res.cabinId} (No disponible)`,
                description: 'Cabaña no encontrada o deshabilitada',
                location: {
                  address: 'Ubicación no disponible',
                  coordinates: { lat: 0, lng: 0 },
                  zone: 'N/A',
                },
                active: false,
                capacity: 0,
                bedrooms: 0,
                bathrooms: 0,
                basePrice: 0,
                maxGuests: 0,
                amenities: [],
                defaultCheckInTime: '15:00',
                defaultCheckOutTime: '11:00',
              })),
            ]);
            return { ...res, user, cabin };
          } catch (error) {
            console.error(`Error enriching reservation ${res.id}:`, error);
            return {
              ...res,
              user: {
                id: res.userId,
                fullName: `Usuario #${res.userId} (No disponible)`,
                email: 'email@nodisponible.com',
                documentNumber: 'N/A',
                role: 'PROFESSOR' as const,
                active: false,
              },
              cabin: {
                id: res.cabinId,
                name: `Cabaña #${res.cabinId} (No disponible)`,
                description: 'Cabaña no encontrada o deshabilitada',
                location: {
                  address: 'Ubicación no disponible',
                  coordinates: { lat: 0, lng: 0 },
                  zone: 'N/A',
                },
                active: false,
                capacity: 0,
                bedrooms: 0,
                bathrooms: 0,
                basePrice: 0,
                maxGuests: 0,
                amenities: [],
                defaultCheckInTime: '15:00',
                defaultCheckOutTime: '11:00',
              },
            };
          }
        })
      );

      return enrichedReservations;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
