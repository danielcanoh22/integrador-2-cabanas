'use client';

import { CabinList } from '@/components/features/cabins/cabin-list';
import { useCabins } from '@/hooks/useCabins';

export default function Cabins() {
  const { data: cabins = [], isLoading, error } = useCabins();

  if (isLoading) {
    return (
      <div>
        <div className='flex flex-col gap-6 items-center mb-12'>
          <h1 className='text-5xl font-bold text-primary-purple text-center'>
            Cabañas Disponibles
          </h1>
          <p className='text-2xl text-gray-500 dark:text-gray-200'>
            ¡Tu descanso ideal te espera con Cooprudea Social!
          </p>
        </div>
        <div className='text-center py-12'>
          <p className='text-lg text-muted-foreground'>Cargando cabañas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className='flex flex-col gap-6 items-center mb-12'>
          <h1 className='text-5xl font-bold text-primary-purple text-center'>
            Cabañas Disponibles
          </h1>
        </div>
        <div className='text-center py-12'>
          <p className='text-lg text-red-600'>Error al cargar las cabañas</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex flex-col gap-6 items-center mb-12'>
        <h1 className='text-5xl font-bold text-primary-purple text-center'>
          Cabañas Disponibles
        </h1>
        <p className='text-2xl text-gray-500 dark:text-gray-200'>
          ¡Tu descanso ideal te espera con Cooprudea Social!
        </p>
      </div>

      {cabins.length === 0 ? (
        <p className='text-center text-muted-foreground'>
          No hay cabañas disponibles en este momento.
        </p>
      ) : (
        <CabinList cabins={cabins} />
      )}
    </div>
  );
}
