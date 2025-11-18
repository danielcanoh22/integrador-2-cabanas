'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { changePassword } from '@/services/users';
import {
  useSystemConfigurations,
  useUpdateConfiguration,
} from '@/hooks/useConfigurations';
import { ConfigurationKey, ConfigurationMetadata } from '@/types/configuration';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface AdminSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const configMetadata: ConfigurationMetadata[] = [
  {
    key: 'reservation.timeout.minutes',
    label: 'Tiempo de Expiración de Reserva',
    description:
      'Tiempo en minutos para confirmar una reserva antes de que expire',
    type: 'number',
    unit: 'minutos',
  },
  {
    key: 'waitinglist.notification.hours',
    label: 'Notificación de Lista de Espera',
    description: 'Horas de notificación para reclamar lugar en lista de espera',
    type: 'number',
    unit: 'horas',
  },
  {
    key: 'system.maintenance.mode',
    label: 'Modo Mantenimiento',
    description: 'Indica si el sistema está en modo mantenimiento',
    type: 'boolean',
  },
  {
    key: 'jwt.refresh.days',
    label: 'Duración Token de Refresco',
    description: 'Duración del token de refresco en días',
    type: 'number',
    unit: 'días',
  },
  {
    key: 'reservation.penalty.days',
    label: 'Días de Penalización',
    description: 'Días de penalización por cancelación tardía',
    type: 'number',
    unit: 'días',
  },
  {
    key: 'reservation.max.per.year',
    label: 'Máximo de Reservas por Año',
    description: 'Máximo número de reservas por usuario por año',
    type: 'number',
    unit: 'reservas',
  },
  {
    key: 'jwt.access.minutes',
    label: 'Duración Token de Acceso',
    description: 'Duración del token de acceso en minutos',
    type: 'number',
    unit: 'minutos',
  },
  {
    key: 'email.notifications.enabled',
    label: 'Notificaciones por Email',
    description: 'Habilita las notificaciones por email',
    type: 'boolean',
  },
];

export const AdminSettingsModal = ({
  open,
  onOpenChange,
}: AdminSettingsModalProps) => {
  const [activeTab, setActiveTab] = useState('password');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { data: configurations, isLoading: isLoadingConfigs } =
    useSystemConfigurations();
  const updateConfigMutation = useUpdateConfiguration();

  const [localConfigs, setLocalConfigs] = useState<Record<string, string>>({});
  const [editingKey, setEditingKey] = useState<ConfigurationKey | null>(null);

  useEffect(() => {
    if (configurations) {
      setLocalConfigs({ ...configurations });
    }
  }, [configurations]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener mínimo 6 caracteres');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      toast.success('Contraseña cambiada exitosamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error((error as Error).message || 'Error al cambiar la contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleConfigUpdate = async (key: ConfigurationKey, value: string) => {
    updateConfigMutation.mutate(
      { key, data: { value } },
      {
        onSuccess: () => {
          setEditingKey(null);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isChangingPassword && !updateConfigMutation.isPending) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setEditingKey(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
          <DialogDescription>
            Gestiona tu contraseña y las configuraciones del sistema.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='password'>Contraseña</TabsTrigger>
            <TabsTrigger value='system'>Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value='password' className='space-y-4'>
            <form onSubmit={handlePasswordSubmit}>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='currentPassword'>Contraseña Actual</Label>
                  <Input
                    id='currentPassword'
                    type='password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={isChangingPassword}
                  />
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='newPassword'>Nueva Contraseña</Label>
                  <Input
                    id='newPassword'
                    type='password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isChangingPassword}
                    placeholder='Mínimo 6 caracteres'
                  />
                </div>

                <div className='grid gap-2'>
                  <Label htmlFor='confirmPassword'>
                    Confirmar Nueva Contraseña
                  </Label>
                  <Input
                    id='confirmPassword'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isChangingPassword}
                    placeholder='Mínimo 6 caracteres'
                  />
                </div>
              </div>

              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleClose}
                  disabled={isChangingPassword}
                  className='cursor-pointer'
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  disabled={isChangingPassword}
                  className='bg-primary-green hover:bg-primary-green/90 text-white cursor-pointer'
                >
                  {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value='system' className='space-y-4'>
            {isLoadingConfigs ? (
              <div className='flex items-center justify-center py-8'>
                <Loader2 className='h-6 w-6 animate-spin text-primary-purple' />
              </div>
            ) : (
              <div className='space-y-6 py-4'>
                {configMetadata.map((config) => (
                  <div
                    key={config.key}
                    className='border rounded-lg p-4 space-y-3'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <Label className='text-base font-semibold'>
                          {config.label}
                        </Label>
                        <p className='text-sm text-muted-foreground mt-1'>
                          {config.description}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      {config.type === 'boolean' ? (
                        <div className='flex items-center space-x-2'>
                          <Switch
                            id={config.key}
                            checked={localConfigs[config.key] === 'true'}
                            onCheckedChange={(checked) => {
                              const newValue = checked ? 'true' : 'false';
                              setLocalConfigs((prev) => ({
                                ...prev,
                                [config.key]: newValue,
                              }));
                              handleConfigUpdate(config.key, newValue);
                            }}
                            disabled={updateConfigMutation.isPending}
                          />
                          <Label
                            htmlFor={config.key}
                            className='cursor-pointer'
                          >
                            {localConfigs[config.key] === 'true'
                              ? 'Activado'
                              : 'Desactivado'}
                          </Label>
                        </div>
                      ) : (
                        <>
                          <Input
                            type='number'
                            value={localConfigs[config.key] || ''}
                            onChange={(e) =>
                              setLocalConfigs((prev) => ({
                                ...prev,
                                [config.key]: e.target.value,
                              }))
                            }
                            onFocus={() => setEditingKey(config.key)}
                            disabled={updateConfigMutation.isPending}
                            className='max-w-[150px]'
                          />
                          {config.unit && (
                            <span className='text-sm text-muted-foreground'>
                              {config.unit}
                            </span>
                          )}
                          {editingKey === config.key &&
                            localConfigs[config.key] !==
                              configurations?.[config.key] && (
                              <Button
                                size='sm'
                                onClick={() =>
                                  handleConfigUpdate(
                                    config.key,
                                    localConfigs[config.key]
                                  )
                                }
                                disabled={updateConfigMutation.isPending}
                                className='bg-primary-green hover:bg-primary-green/90 cursor-pointer text-white'
                              >
                                Guardar
                              </Button>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className='flex justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={updateConfigMutation.isPending}
                className='cursor-pointer'
              >
                Cerrar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
