'use client';

import { ReservationFilters } from '@/components/features/admin/reservations/reservation-filters';
import { ReservationsPagination } from '@/components/features/admin/reservations/reservation-pagination';
import { ReservationsTable } from '@/components/features/admin/reservations/reservation-table';
import { StatsCards } from '@/components/features/admin/reservations/stats-card';
import { getCabinById } from '@/services/cabins';
import { getAllReservations } from '@/services/reservations';
import { getUserById } from '@/services/user';
import { BasicReservation, EnrichedReservation } from '@/types/reservation';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState<EnrichedReservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAndEnrichReservations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAllReservations(
          currentPage - 1,
          itemsPerPage
        );
        const basicReservations: BasicReservation[] = response.items;

        if (basicReservations.length === 0) {
          setReservations([]);
          return;
        }

        const detailPromises = basicReservations.flatMap((res) => [
          getUserById(res.userId),
          getCabinById(String(res.cabinId)),
        ]);

        const detailsResults = await Promise.all(detailPromises);

        const enrichedReservations = basicReservations.map((res, index) => {
          const user = detailsResults[index * 2];
          const cabin = detailsResults[index * 2 + 1];
          return { ...res, user, cabin };
        });

        setReservations(enrichedReservations);
      } catch (err) {
        setError((err as Error).message);
        toast.error(`Error: ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndEnrichReservations();
  }, [currentPage]);

  const handleStatusChange = (reservationId: number, newStatus: string) => {
    // setReservations(
    //   reservations.map((res) =>
    //     res.id === reservationId ? { ...res, status: newStatus } : res
    //   )
    // );
    toast.success(`La reserva ha sido actualizada.`);
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.user.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.cabin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReservations = filteredReservations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter((r) => r.status === 'CONFIRMED').length,
    pending: reservations.filter((r) => r.status === 'PENDING').length,
    cancelled: reservations.filter((r) => r.status === 'CANCELLED').length,
    totalRevenue: reservations
      .filter((r) => r.status === 'CONFIRMED')
      .reduce((sum, r) => sum + r.total!, 0),
  };

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
