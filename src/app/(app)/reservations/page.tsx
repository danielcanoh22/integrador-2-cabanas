'use client';

import { ReservationCard } from '@/components/features/reservations/reservation-card';
import { sortReservationsByStatus } from '@/lib/helpers';
import {
  useUserReservations,
  useCancelReservation,
} from '@/hooks/useReservations';

export default function Reservations() {
  const { data: reservations = [], isLoading } = useUserReservations();
  const cancelReservationMutation = useCancelReservation();

  const handleCancelReservation = async (reservationId: number) => {
    return new Promise<void>((resolve, reject) => {
      cancelReservationMutation.mutate(reservationId, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  if (isLoading) {
    return (
      <div className='flex flex-col min-h-screen gap-6'>
        <h1 className='text-5xl font-bold text-primary-blue text-center mb-10'>
          Mis Reservas
        </h1>
        <div className='text-center'>Cargando reservas...</div>
      </div>
    );
  }

  const orderedReservations = sortReservationsByStatus(reservations);

  return (
    <div className='flex flex-col min-h-screen gap-6'>
      <h1 className='text-5xl font-bold text-primary-blue text-center mb-10'>
        Mis Reservas
      </h1>

      {reservations.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground text-lg'>
            No tienes reservas aún. ¡Haz tu primera reserva!
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(300px,320))] gap-4'>
          {orderedReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={handleCancelReservation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
