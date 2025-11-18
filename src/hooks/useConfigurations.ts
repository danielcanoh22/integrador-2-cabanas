import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSystemConfigurations,
  updateConfiguration,
} from '@/services/configurations';
import {
  ConfigurationKey,
  UpdateConfigurationRequest,
} from '@/types/configuration';
import toast from 'react-hot-toast';

export const configurationKeys = {
  all: ['configurations'] as const,
  system: () => [...configurationKeys.all, 'system'] as const,
};

export const useSystemConfigurations = () => {
  return useQuery({
    queryKey: configurationKeys.system(),
    queryFn: getSystemConfigurations,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useUpdateConfiguration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      key,
      data,
    }: {
      key: ConfigurationKey;
      data: UpdateConfigurationRequest;
    }) => updateConfiguration(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: configurationKeys.system() });
      toast.success('Configuración actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar la configuración');
    },
  });
};
