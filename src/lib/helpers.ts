import { BasicReservation } from '@/types/reservation';

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const sortReservationsByStatus = <T extends BasicReservation>(
  reservations: T[]
): T[] => {
  const statusOrder = {
    PENDING: 1,
    CONFIRMED: 2,
    IN_USE: 3,
    COMPLETED: 4,
    CANCELLED: 5,
  };

  const reservationsToSort = [...reservations];

  reservationsToSort.sort((a, b) => {
    const orderA = statusOrder[a.status] || 99;
    const orderB = statusOrder[b.status] || 99;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;

    return dateB - dateA;
  });

  return reservationsToSort;
};
