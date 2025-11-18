import { apiClient } from '@/lib/apiClient';
import {
  SystemConfiguration,
  ConfigurationKey,
  UpdateConfigurationRequest,
} from '@/types/configuration';

/**
 * Obtiene todas las configuraciones del sistema (admin)
 */
export async function getSystemConfigurations(): Promise<SystemConfiguration> {
  return apiClient('/admin/configurations', {
    method: 'GET',
  });
}

/**
 * Actualiza una configuración específica del sistema (admin)
 */
export async function updateConfiguration(
  key: ConfigurationKey,
  data: UpdateConfigurationRequest
): Promise<void> {
  await apiClient(`/admin/configurations/${key}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
