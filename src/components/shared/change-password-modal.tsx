'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword } from '@/services/users';
import toast from 'react-hot-toast';
import { getUserProfile } from '@/services/users';
import { User } from '@/types/user';

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordModal = ({
  open,
  onOpenChange,
}: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isPinMode, setIsPinMode] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchUser = async () => {
        try {
          const userData = await getUserProfile();
          setUser(userData);
          setIsPinMode(userData.role !== 'ADMIN');
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }

    if (user?.role === 'ADMIN') {
      if (newPassword.length < 6) {
        toast.error(
          'Los administradores deben usar contraseña de mínimo 6 caracteres'
        );
        return;
      }
    } else {
      if (isPinMode) {
        if (newPassword.length !== 4 || !/^\d{4}$/.test(newPassword)) {
          toast.error('El PIN debe tener exactamente 4 dígitos');
          return;
        }
      } else {
        if (newPassword.length < 6 || newPassword.length > 50) {
          toast.error('La contraseña debe tener entre 6 y 50 caracteres');
          return;
        }
      }
    }

    setIsLoading(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      toast.success('Contraseña cambiada exitosamente');
      onOpenChange(false);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setUser(null);
      setIsPinMode(false);
    } catch (error) {
      toast.error((error as Error).message || 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setUser(null);
      setIsPinMode(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Cambiar Contraseña</DialogTitle>
          <DialogDescription>
            Ingresa tu contraseña actual y la nueva contraseña para cambiarla.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='currentPassword'>Contraseña Actual</Label>
              <Input
                id='currentPassword'
                type='password'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className='grid gap-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='newPassword'>
                  {user?.role === 'ADMIN'
                    ? 'Nueva Contraseña'
                    : isPinMode
                    ? 'Nuevo PIN'
                    : 'Nueva Contraseña'}
                </Label>
                {user?.role !== 'ADMIN' && (
                  <button
                    type='button'
                    onClick={() => setIsPinMode(!isPinMode)}
                    className='text-sm text-primary-green hover:underline'
                    disabled={isLoading}
                  >
                    {isPinMode ? 'Usar contraseña' : 'Usar PIN'}
                  </button>
                )}
              </div>
              <Input
                id='newPassword'
                type={isPinMode ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder={isPinMode ? '4 dígitos' : 'Mínimo 6 caracteres'}
                maxLength={isPinMode ? 4 : 50}
              />
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='confirmPassword'>
                {user?.role === 'ADMIN'
                  ? 'Confirmar Nueva Contraseña'
                  : isPinMode
                  ? 'Confirmar Nuevo PIN'
                  : 'Confirmar Nueva Contraseña'}
              </Label>
              <Input
                id='confirmPassword'
                type={isPinMode ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder={isPinMode ? '4 dígitos' : 'Mínimo 6 caracteres'}
                maxLength={isPinMode ? 4 : 50}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isLoading}
              className='cursor-pointer'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='bg-primary-green hover:bg-primary-green/90 text-white cursor-pointer'
            >
              {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
