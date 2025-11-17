import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllReservations,
  getUserReservations,
  createReservation,
  updateReservationStatus,
  deleteReservation,
} from '@/services/reservations';
import {
  BasicReservation,
  CreateReservationRequest,
  ReservationStatus,
  EnrichedReservation,
  PageResponse,
} from '@/types/reservation';
import { getCabinById } from '@/services/cabins';
import { UserRole } from '@/types/user';
import toast from 'react-hot-toast';

export const reservationKeys = {
  all: ['reservations'] as const,
  lists: () => [...reservationKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...reservationKeys.lists(), filters] as const,
  admin: (page?: number, size?: number) =>
    [...reservationKeys.all, 'admin', { page, size }] as const,
  user: () => [...reservationKeys.all, 'user'] as const,
};

/**
 * Hook para obtener todas las reservas (admin) con paginación
 */
export const useAdminReservations = (page = 0, size = 10) => {
  return useQuery({
    queryKey: reservationKeys.admin(page, size),
    queryFn: () => getAllReservations(page, size),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook para obtener las reservas del usuario autenticado (enriquecidas con datos de cabaña)
 */
export const useUserReservations = () => {
  return useQuery({
    queryKey: reservationKeys.user(),
    queryFn: async (): Promise<EnrichedReservation[]> => {
      const basicReservations = await getUserReservations();

      if (basicReservations.length === 0) {
        return [];
      }

      const enrichedReservations = await Promise.all(
        basicReservations.map(async (res) => {
          try {
            const cabin = await getCabinById(String(res.cabinId));
            return {
              ...res,
              cabin,
              user: {
                id: res.userId,
                fullName: '',
                email: '',
                documentNumber: '',
                role: 'PROFESSOR' as UserRole,
                active: true,
              },
            };
          } catch {
            return {
              ...res,
              cabin: {
                id: res.cabinId,
                name: `Cabaña #${res.cabinId}`,
                description: 'Información no disponible',
                location: {
                  address: 'Ubicación no disponible',
                  coordinates: { lat: 0, lng: 0 },
                  zone: 'N/A',
                },
                active: false,
                capacity: 0,
                maxGuests: 0,
                bedrooms: 0,
                bathrooms: 0,
                basePrice: 0,
                defaultCheckInTime: '14:00',
                defaultCheckOutTime: '12:00',
                amenities: [],
              },
              user: {
                id: res.userId,
                fullName: '',
                email: '',
                documentNumber: '',
                role: 'PROFESSOR' as UserRole,
                active: true,
              },
            } as EnrichedReservation;
          }
        })
      );

      return enrichedReservations;
    },
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

/**
 * Hook para crear una reserva
 */
export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReservationRequest) => createReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.user() });
      queryClient.invalidateQueries({
        queryKey: [...reservationKeys.all, 'admin'],
      });
      toast.success('Reserva creada exitosamente', {
        duration: 3000,
        position: 'bottom-right',
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear la reserva');
    },
  });
};

/**
 * Hook para actualizar el estado de una reserva (admin) con optimistic update
 */
export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ReservationStatus }) =>
      updateReservationStatus(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({
        queryKey: reservationKeys.all,
      });

      const previousAdminData = queryClient.getQueryData([
        ...reservationKeys.all,
        'admin',
      ]);
      const previousUserData = queryClient.getQueryData(reservationKeys.user());

      queryClient.setQueriesData(
        { queryKey: [...reservationKeys.all, 'admin'] },
        (old: unknown) => {
          if (!old || typeof old !== 'object' || !('items' in old)) return old;
          const data = old as PageResponse<BasicReservation>;
          return {
            ...data,
            items: data.items.map((res) =>
              res.id === id ? { ...res, status } : res
            ),
          };
        }
      );

      queryClient.setQueryData<EnrichedReservation[]>(
        reservationKeys.user(),
        (old) => {
          if (!old) return old;
          return old.map((res) => (res.id === id ? { ...res, status } : res));
        }
      );

      return { previousAdminData, previousUserData };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousAdminData) {
        queryClient.setQueryData(
          [...reservationKeys.all, 'admin'],
          context.previousAdminData
        );
      }
      if (context?.previousUserData) {
        queryClient.setQueryData(
          reservationKeys.user(),
          context.previousUserData
        );
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al actualizar el estado de la reserva';

      if (errorMessage.includes('Transición de estado no permitida')) {
        toast.error(
          'Esta transición de estado no está permitida. Verifica el estado actual de la reserva.'
        );
      } else if (errorMessage.includes('Conflict')) {
        toast.error(
          'No se puede cambiar el estado: conflicto con el estado actual.'
        );
      } else {
        toast.error(errorMessage);
      }
    },
    onSuccess: (_, { status }) => {
      const statusMessages: Record<ReservationStatus, string> = {
        PENDING: 'Pendiente',
        CONFIRMED: 'Confirmada',
        CANCELLED: 'Cancelada',
        IN_USE: 'En uso',
        COMPLETED: 'Completada',
      };

      toast.success(`La reserva ha sido ${statusMessages[status] || status}.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: reservationKeys.all,
      });
    },
  });
};

/**
 * Hook para cancelar/eliminar una reserva (usuario) con optimistic update
 */
export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteReservation(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: reservationKeys.user() });
      const previousReservations = queryClient.getQueryData<
        EnrichedReservation[]
      >(reservationKeys.user());

      if (previousReservations) {
        queryClient.setQueryData<EnrichedReservation[]>(
          reservationKeys.user(),
          previousReservations.map((res) =>
            res.id === id
              ? { ...res, status: 'CANCELLED' as ReservationStatus }
              : res
          )
        );
      }

      return { previousReservations };
    },
    onError: (error: Error, _id, context) => {
      if (context?.previousReservations) {
        queryClient.setQueryData(
          reservationKeys.user(),
          context.previousReservations
        );
      }
      toast.error(error.message || 'Error al cancelar la reserva');
    },
    onSuccess: () => {
      toast.success('Reserva cancelada exitosamente');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.user() });
      queryClient.invalidateQueries({
        queryKey: [...reservationKeys.all, 'admin'],
      });
    },
  });
};
