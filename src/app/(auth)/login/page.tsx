'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/services/auth';
import Link from 'next/link';
import { ForceChangePasswordModal } from '@/components/shared/force-change-password-modal';

export default function Login() {
  const router = useRouter();
  const [documentNumber, setDocumentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForceChangePassword, setShowForceChangePassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await login({ documentNumber, password });

      Cookies.set('accessToken', data.accessToken, { expires: 7 });
      Cookies.set('refreshToken', data.refreshToken, { expires: 30 });

      if (data.mustChangePassword) {
        Cookies.set('mustChangePassword', 'true', { expires: 7 });
        setShowForceChangePassword(true);
        toast.success('Inicio de sesión exitoso');
      } else {
        toast.success('¡Bienvenido de vuelta!');
        router.push('/cabins');
      }
    } catch (error) {
      toast.error((error as Error).message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-6'>
      <Card className='w-full max-w-96'>
        <CardHeader>
          <Image
            src='/assets/image/logo.png'
            width={132}
            height={44}
            alt='Logo de Cooprudea'
            className='mx-auto'
          />
        </CardHeader>
        <CardContent>
          <form>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='cc'>Cédula</Label>
                <Input
                  id='cc'
                  type='text'
                  placeholder='1234567890'
                  required
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='password'>Contraseña</Label>

                  {/* <div className='text-center text-sm'>
                    <a
                      href='#'
                      className='ml-auto inline-block text-sm text-gray-700 dark:text-gray-300 underline-offset-4 hover:underline'
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div> */}
                </div>
                <Input
                  id='password'
                  type='password'
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className='flex flex-col gap-3'>
                <Button
                  type='submit'
                  className='w-full bg-primary-green text-white hover:bg-primary-green/90 cursor-pointer'
                  disabled={isLoading}
                  onClick={handleLogin}
                >
                  {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
                </Button>
              </div>

              <p className='text-center text-sm text-gray-700 dark:text-gray-300'>
                ¿No tienes una cuenta?{' '}
                <Link
                  href='/register'
                  className='underline underline-offset-6 hover:text-primary-green dark:hover:text-white'
                >
                  Regístrate
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <ForceChangePasswordModal
        open={showForceChangePassword}
        onPasswordChanged={() => {
          Cookies.remove('mustChangePassword');
          setShowForceChangePassword(false);
          toast.success('¡Contraseña actualizada! Redirigiendo...');
          setTimeout(() => {
            router.push('/cabins');
          }, 1000);
        }}
      />
    </div>
  );
}
