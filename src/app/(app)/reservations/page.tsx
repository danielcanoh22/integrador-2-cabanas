import { ReservationCard } from '@/components/features/reservations/reservation-card';
import { sortReservationsByStatus } from '@/lib/helpers';

const mockReservations = [
  {
    id: 1,
    cabinName: 'Cabaña del Lago',
    cabinImage: '/assets/image/cabin-1.jpg',
    location: 'Lago del Sol 123, Villa del Lago',
    checkIn: new Date('2025-10-24'),
    checkOut: new Date('2025-10-26'),
    guests: 6,
    status: 'pendiente',
    total: 300,
    createdAt: new Date('2025-10-05'),
  },
  // {
  //   id: 2,
  //   cabinName: 'Cabaña La Provincia',
  //   cabinImage: '/assets/image/cabin-1.jpg',
  //   location: 'Santa Fé, Antioquia',
  //   checkIn: new Date('2025-10-15'),
  //   checkOut: new Date('2025-10-17'),
  //   guests: 4,
  //   status: 'pendiente',
  //   total: 300000,
  //   createdAt: new Date('2025-09-15'),
  // },
  // {
  //   id: 3,
  //   cabinName: 'Cabaña La Provincia',
  //   cabinImage: '/assets/image/cabin-1.jpg',
  //   location: 'Santa Fé, Antioquia',
  //   checkIn: new Date('2025-10-15'),
  //   checkOut: new Date('2025-10-17'),
  //   guests: 4,
  //   status: 'cancelada',
  //   total: 300000,
  //   createdAt: new Date('2025-09-15'),
  // },
];

export default function Reservations() {
  const orderedReservations = sortReservationsByStatus(mockReservations);

  return (
    <div className='flex flex-col min-h-screen gap-6'>
      <h1 className='text-5xl font-bold text-primary-blue text-center mb-10'>
        Mis Reservas
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(300px,320))] gap-4'>
        {orderedReservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
    </div>
  );
}
