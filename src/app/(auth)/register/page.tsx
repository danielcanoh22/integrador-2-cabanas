'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { register as registerService } from '@/services/auth';
import { RegisterPayload } from '@/types/auth';

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<RegisterPayload['role']>('PROFESSOR');
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, '');
    const local = digits.slice(-10);
    if (local.length < 10) return `+57-${local}`;
    return `+57-${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(
      6,
      10
    )}`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) {
      toast.error('El PIN debe tener 4 dígitos.');
      return;
    }
    if (pin !== confirmPin) {
      toast.error('El PIN y la confirmación no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: RegisterPayload = {
        documentNumber,
        email,
        name,
        phone: formatPhone(phone),
        pin,
        role,
      };

      await registerService(payload);
      toast.success('Cuenta creada correctamente.');
      router.push('/login');
    } catch (error) {
      toast.error((error as Error).message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-6'>
      <Card className='w-full max-w-[500px]'>
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
          <form onSubmit={handleRegister}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='name'>Nombre</Label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Juan Pérez'
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='cc'>Número de documento</Label>
                <Input
                  id='cc'
                  type='text'
                  placeholder='1234567890'
                  required
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  disabled={isLoading}
                  inputMode='numeric'
                />
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='correo@ejemplo.com'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='pin'>PIN (4 dígitos)</Label>
                <Input
                  id='pin'
                  type='password'
                  placeholder='••••'
                  required
                  value={pin}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
                    setPin(v);
                  }}
                  disabled={isLoading}
                  inputMode='numeric'
                  maxLength={4}
                />
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='confirmPin'>Confirmar PIN</Label>
                <Input
                  id='confirmPin'
                  type='password'
                  placeholder='••••'
                  required
                  value={confirmPin}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
                    setConfirmPin(v);
                  }}
                  disabled={isLoading}
                  inputMode='numeric'
                  maxLength={4}
                />
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='phone'>Teléfono</Label>
                <Input
                  id='phone'
                  type='tel'
                  placeholder='3001234567'
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  inputMode='tel'
                />
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='role'>Rol</Label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as RegisterPayload['role'])}
                  disabled={isLoading}
                >
                  <SelectTrigger id='role' className='w-full'>
                    <SelectValue placeholder='Selecciona un rol' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='PROFESSOR'>Profesor</SelectItem>
                    <SelectItem value='RETIREE'>Retirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='md:col-span-2 flex flex-col gap-3'>
                <Button
                  type='submit'
                  className='w-full bg-primary-green text-white hover:bg-primary-green/90 cursor-pointer'
                  disabled={isLoading}
                >
                  {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
              </div>

              <p className='md:col-span-2 text-center text-sm text-gray-700 dark:text-gray-300'>
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href='/login'
                  className='underline underline-offset-6 hover:text-primary-green dark:hover:text-white'
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
