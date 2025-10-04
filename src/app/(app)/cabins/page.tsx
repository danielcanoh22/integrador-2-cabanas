import { CabinList } from '@/components/features/cabins/cabin-list';
import { getAllCabins } from '@/services/cabins';

export default async function Cabins() {
  const cabins = await getAllCabins();

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
        <p>No hay cabañas disponibles en este momento.</p>
      ) : (
        <CabinList cabins={cabins} />
      )}
    </div>
  );
}
