import { Cabin } from '@/types/cabin';
import { CabinCard } from './cabin-card';

type CabinListProps = {
  cabins: Cabin[];
};

export const CabinList = ({ cabins }: CabinListProps) => {
  return (
    <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6'>
      {cabins.map((cabin) => (
        <CabinCard key={cabin.id} cabin={cabin} />
      ))}
    </div>
  );
};
