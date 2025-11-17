'use client';

import { ReservationFilters } from '@/components/features/admin/reservations/reservation-filters';
import { ReservationsPagination } from '@/components/features/admin/reservations/reservation-pagination';
import { ReservationsTable } from '@/components/features/admin/reservations/reservation-table';
import { StatsCards } from '@/components/features/admin/reservations/stats-card';
import { useEnrichedReservations } from '@/hooks/useEnrichedReservations';
import { useUpdateReservationStatus } from '@/hooks/useReservations';
import { ReservationStatus } from '@/types/reservation';
import { useMemo, useState } from 'react';

export default function ReservationManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: reservations = [], isLoading } = useEnrichedReservations(
    currentPage - 1,
    itemsPerPage
  );

  const updateStatusMutation = useUpdateReservationStatus();

  const handleStatusChange = (reservationId: number, newStatus: string) => {
    updateStatusMutation.mutate({
      id: reservationId,
      status: newStatus as ReservationStatus,
    });
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesSearch =
        reservation.user.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        reservation.cabin.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        reservation.user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' || reservation.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReservations = filteredReservations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const stats = useMemo(
    () => ({
      total: reservations.length,
      confirmed: reservations.filter((r) => r.status === 'CONFIRMED').length,
      pending: reservations.filter((r) => r.status === 'PENDING').length,
      cancelled: reservations.filter((r) => r.status === 'CANCELLED').length,
      totalRevenue: reservations
        .filter((r) => r.status === 'CONFIRMED')
        .reduce((sum, r) => sum + (r.finalPrice || r.total || 0), 0),
    }),
    [reservations]
  );

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center py-12'>Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2 text-primary-purple'>
          Administrar Reservas
        </h1>
        <p className='text-muted-foreground'>
          Gestiona todas las reservas del sistema
        </p>
      </div>

      <StatsCards stats={stats} />

      <ReservationFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        onStatusFilterChange={(value) => {
          setStatusFilter(value);
          setCurrentPage(1);
        }}
      />

      <ReservationsTable
        reservations={currentReservations}
        onStatusChange={handleStatusChange}
      />

      <ReservationsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
