import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCabins, getCabinById } from '@/services/cabins';
import { updateCabinStatus } from '@/services/cabins-admin';
import { Cabin } from '@/types/cabin';
import toast from 'react-hot-toast';

export const cabinKeys = {
  all: ['cabins'] as const,
  lists: () => [...cabinKeys.all, 'list'] as const,
  list: (filters?: string) => [...cabinKeys.lists(), { filters }] as const,
  details: () => [...cabinKeys.all, 'detail'] as const,
  detail: (id: string) => [...cabinKeys.details(), id] as const,
};

/**
 * Hook para obtener todas las cabañas
 */
export const useCabins = () => {
  return useQuery({
    queryKey: cabinKeys.lists(),
    queryFn: getAllCabins,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener una cabaña por ID
 */
export const useCabinById = (id: string) => {
  return useQuery({
    queryKey: cabinKeys.detail(id),
    queryFn: () => getCabinById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para actualizar el estado activo de una cabaña (con optimistic update)
 */
export const useUpdateCabinStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      updateCabinStatus(id, { active }),
    // Optimistic update
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: cabinKeys.lists() });

      const previousCabins = queryClient.getQueryData<Cabin[]>(
        cabinKeys.lists()
      );

      if (previousCabins) {
        queryClient.setQueryData<Cabin[]>(
          cabinKeys.lists(),
          previousCabins.map((cabin) =>
            cabin.id === id ? { ...cabin, active } : cabin
          )
        );
      }

      return { previousCabins };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousCabins) {
        queryClient.setQueryData(cabinKeys.lists(), context.previousCabins);
      }
      toast.error(
        error.message || 'Error al actualizar el estado de la cabaña'
      );
    },
    onSuccess: (_, { active }) => {
      toast.success(
        `Cabaña ${active ? 'activada' : 'desactivada'} exitosamente`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cabinKeys.lists() });
    },
  });
};
