export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// TODO: Crear el tipo Reservation. Cambiar los estados por los que devuelva el backend.
export const sortReservationsByStatus = (reservations) => {
  const statusOrder = {
    pendiente: 1,
    confirmada: 2,
    cancelada: 3,
  };

  const reservationsToSort = [...reservations];

  reservationsToSort.sort((a, b) => {
    const orderA = statusOrder[a.status] || 99;
    const orderB = statusOrder[b.status] || 99;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return reservationsToSort;
};
