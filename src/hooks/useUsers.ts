import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, changePassword } from '@/services/users';
import { ChangePasswordRequest } from '@/types/user';
import toast from 'react-hot-toast';

export const userKeys = {
  all: ['users'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
};

/**
 * Hook para obtener el perfil del usuario autenticado
 */
export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: getUserProfile,
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 1,
  });
};

/**
 * Hook para cambiar la contraseña del usuario
 */
export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      toast.success('Contraseña cambiada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al cambiar la contraseña');
    },
  });
};
