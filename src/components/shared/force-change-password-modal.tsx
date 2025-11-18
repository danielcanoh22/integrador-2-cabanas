'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword } from '@/services/users';
import toast from 'react-hot-toast';
import { AlertCircle, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ForceChangePasswordModalProps = {
  open: boolean;
  onPasswordChanged: () => void;
};

export const ForceChangePasswordModal = ({
  open,
  onPasswordChanged,
}: ForceChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      toast.success('Contraseña actualizada exitosamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onPasswordChanged();
    } catch (error) {
      toast.error((error as Error).message || 'Error al cambiar la contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className='sm:max-w-[500px]'
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <div className='flex items-center gap-2 mb-2'>
            <Lock className='h-6 w-6 text-primary-purple' />
            <DialogTitle className='text-xl'>
              Cambio de Contraseña Obligatorio
            </DialogTitle>
          </div>
          <DialogDescription>
            Es necesario cambiar tu contraseña para continuar
          </DialogDescription>
        </DialogHeader>

        <Alert
          variant='default'
          className='border-amber-500 bg-amber-50 dark:bg-amber-950/20'
        >
          <AlertCircle className='h-4 w-4 text-amber-600 dark:text-amber-500' />
          <AlertTitle className='text-amber-800 dark:text-amber-400'>
            Cambio de rol detectado
          </AlertTitle>
          <AlertDescription className='text-amber-700 dark:text-amber-300'>
            Tu cuenta ha sido promovida a Administrador. Por seguridad, debes
            establecer una nueva contraseña antes de continuar.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleChangePassword} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='current-password'>Contraseña Actual</Label>
            <Input
              id='current-password'
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isChangingPassword}
              required
              placeholder='Ingresa tu contraseña actual'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='new-password'>Nueva Contraseña</Label>
            <Input
              id='new-password'
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isChangingPassword}
              required
              placeholder='Mínimo 6 caracteres'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirm-password'>Confirmar Nueva Contraseña</Label>
            <Input
              id='confirm-password'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isChangingPassword}
              required
              placeholder='Repite la nueva contraseña'
            />
          </div>

          <Button
            type='submit'
            className='w-full bg-primary-green hover:bg-primary-green/90 cursor-pointer text-white'
            disabled={isChangingPassword}
          >
            {isChangingPassword
              ? 'Cambiando contraseña...'
              : 'Cambiar Contraseña'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
