import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function Login() {
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
                <Input id='cc' type='text' placeholder='1234567890' required />
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Contraseña</Label>
                </div>
                <Input id='password' type='password' required />
              </div>
              <div className='flex flex-col gap-3'>
                <Button
                  type='submit'
                  className='w-full bg-primary-green text-white hover:bg-primary-green/90 cursor-pointer'
                >
                  Login
                </Button>
              </div>
            </div>
            <div className='mt-4 text-center text-sm'>
              <a
                href='#'
                className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
