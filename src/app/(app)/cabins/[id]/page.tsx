'use client';

import { CabinDetails } from '@/components/features/cabins/cabin-details';
import { useCabinById } from '@/hooks/useCabins';
import { use } from 'react';

export default function Cabin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: cabin, isLoading, error } = useCabinById(id);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <p className='text-lg text-muted-foreground'>Cargando cabaña...</p>
        </div>
      </div>
    );
  }

  if (error || !cabin) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <h2 className='text-2xl font-bold mb-4'>Cabaña no encontrada</h2>
          <p className='text-muted-foreground mb-6'>
            La cabaña que buscas no existe o no está disponible.
          </p>
        </div>
      </div>
    );
  }

  return <CabinDetails cabin={cabin} />;
}
