'use client';

import { Cabin } from '@/types/cabin';
import { CabinCard } from './cabin-card';
import { useQueryClient } from '@tanstack/react-query';
import { cabinKeys } from '@/hooks/useCabins';
import { getCabinById } from '@/services/cabins';

type CabinListProps = {
  cabins: Cabin[];
};

export const CabinList = ({ cabins }: CabinListProps) => {
  const queryClient = useQueryClient();

  const handleMouseEnter = (cabinId: number) => {
    queryClient.prefetchQuery({
      queryKey: cabinKeys.detail(cabinId.toString()),
      queryFn: () => getCabinById(cabinId.toString()),
      staleTime: 5 * 60 * 1000, // 5 minutos
    });
  };

  return (
    <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6'>
      {cabins.map((cabin) => (
        <div key={cabin.id} onMouseEnter={() => handleMouseEnter(cabin.id)}>
          <CabinCard cabin={cabin} />
        </div>
      ))}
    </div>
  );
};
