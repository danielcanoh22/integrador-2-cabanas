import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-6'>
      <h1 className='text-4xl font-semibold'>Reserva de Cabañas</h1>
      <Button>Reservar</Button>
    </div>
  );
}
