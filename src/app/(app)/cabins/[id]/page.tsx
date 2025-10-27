import { CabinDetails } from '@/components/features/cabins/cabin-details';
import { getCabinById } from '@/services/cabins';

export default async function Cabin({ params }: { params: { id: string } }) {
  const { id } = await params;
  const cabin = await getCabinById(id);

  console.log(cabin);

  if (!cabin) {
    return <div>Cabaña no encontrada.</div>;
  }

  return <CabinDetails cabin={cabin} />;
}
