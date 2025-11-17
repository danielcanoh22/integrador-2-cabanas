import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllAdminCabins,
  getCabinByIdAdmin,
  createCabin,
  updateCabin,
  deleteCabin,
  updateCabinStatus,
} from '@/services/cabins-admin';
import { Cabin, CabinPayload } from '@/types/cabin';
import toast from 'react-hot-toast';
import { cabinKeys } from './useCabins';

export const adminCabinKeys = {
  all: ['admin', 'cabins'] as const,
  lists: () => [...adminCabinKeys.all, 'list'] as const,
  details: () => [...adminCabinKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminCabinKeys.details(), id] as const,
};

/**
 * Hook para obtener todas las cabañas (admin)
 */
export const useAdminCabins = () => {
  return useQuery({
    queryKey: adminCabinKeys.lists(),
    queryFn: getAllAdminCabins,
    staleTime: 3 * 60 * 1000, // 3 minutos
  });
};

/**
 * Hook para obtener una cabaña por ID (admin)
 */
export const useAdminCabinById = (id: number) => {
  return useQuery({
    queryKey: adminCabinKeys.detail(id),
    queryFn: () => getCabinByIdAdmin(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
};

/**
 * Hook para crear una cabaña (admin)
 */
export const useCreateAdminCabin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CabinPayload) => createCabin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCabinKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cabinKeys.all });
      toast.success('Cabaña creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear la cabaña');
    },
  });
};

/**
 * Hook para actualizar una cabaña (admin)
 */
export const useUpdateAdminCabin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CabinPayload }) =>
      updateCabin(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminCabinKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminCabinKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: cabinKeys.all });
      toast.success('Cabaña actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar la cabaña');
    },
  });
};

/**
 * Hook para eliminar una cabaña (admin)
 */
export const useDeleteAdminCabin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCabin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCabinKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cabinKeys.all });
      toast.success('Cabaña eliminada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar la cabaña');
    },
  });
};

/**
 * Hook para actualizar el estado activo de una cabaña (admin) con optimistic update
 */
export const useUpdateAdminCabinStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      updateCabinStatus(id, { active }),
    // Optimistic update
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: adminCabinKeys.lists() });

      const previousCabins = queryClient.getQueryData<Cabin[]>(
        adminCabinKeys.lists()
      );

      if (previousCabins) {
        queryClient.setQueryData<Cabin[]>(
          adminCabinKeys.lists(),
          previousCabins.map((cabin) =>
            cabin.id === id ? { ...cabin, active } : cabin
          )
        );
      }

      return { previousCabins };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousCabins) {
        queryClient.setQueryData(
          adminCabinKeys.lists(),
          context.previousCabins
        );
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
      queryClient.invalidateQueries({ queryKey: adminCabinKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cabinKeys.all });
    },
  });
};
