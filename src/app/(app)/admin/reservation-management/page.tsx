'use client';

import { ReservationFilters } from '@/components/features/admin/reservations/reservation-filters';
import { ReservationsPagination } from '@/components/features/admin/reservations/reservation-pagination';
import { ReservationsTable } from '@/components/features/admin/reservations/reservation-table';
import { StatsCards } from '@/components/features/admin/reservations/stats-card';

import { useState } from 'react';
import toast from 'react-hot-toast';

const mockAdminReservations = [
  {
    id: 1,
    cabinName: 'Cabaña del Bosque',
    cabinLocation: 'Guatapé, Antioquia',
    guestName: 'Carlos Ramírez',
    guestEmail: 'carlos@email.com',
    guestPhone: '+57 300 123 4567',
    checkIn: new Date('2024-10-15'),
    checkOut: new Date('2024-10-17'),
    guests: 4,
    status: 'confirmed',
    total: 300000,
    createdAt: new Date('2024-09-15'),
  },
  {
    id: 2,
    cabinName: 'Vista al Lago',
    cabinLocation: 'El Peñol, Antioquia',
    guestName: 'María González',
    guestEmail: 'maria@email.com',
    guestPhone: '+57 300 987 6543',
    checkIn: new Date('2024-11-20'),
    checkOut: new Date('2024-11-23'),
    guests: 6,
    status: 'pending',
    total: 660000,
    createdAt: new Date('2024-09-16'),
  },
  {
    id: 3,
    cabinName: 'Refugio Cafetero',
    cabinLocation: 'Jardín, Antioquia',
    guestName: 'Juan Torres',
    guestEmail: 'juan@email.com',
    guestPhone: '+57 300 456 7890',
    checkIn: new Date('2024-12-01'),
    checkOut: new Date('2024-12-03'),
    guests: 2,
    status: 'confirmed',
    total: 360000,
    createdAt: new Date('2024-09-20'),
  },
  {
    id: 4,
    cabinName: 'Cabaña Premium',
    cabinLocation: 'Rionegro, Antioquia',
    guestName: 'Ana Martínez',
    guestEmail: 'ana@email.com',
    guestPhone: '+57 300 111 2222',
    checkIn: new Date('2024-08-10'),
    checkOut: new Date('2024-08-12'),
    guests: 8,
    status: 'cancelled',
    total: 700000,
    createdAt: new Date('2024-07-15'),
  },
  {
    id: 5,
    cabinName: 'Vista al Lago',
    cabinLocation: 'El Peñol, Antioquia',
    guestName: 'Pedro Silva',
    guestEmail: 'pedro@email.com',
    guestPhone: '+57 300 333 4444',
    checkIn: new Date('2024-10-25'),
    checkOut: new Date('2024-10-28'),
    guests: 4,
    status: 'confirmed',
    total: 660000,
    createdAt: new Date('2024-09-18'),
  },
  {
    id: 6,
    cabinName: 'Cabaña del Bosque',
    cabinLocation: 'Guatapé, Antioquia',
    guestName: 'Laura Díaz',
    guestEmail: 'laura@email.com',
    guestPhone: '+57 300 555 6666',
    checkIn: new Date('2024-11-05'),
    checkOut: new Date('2024-11-08'),
    guests: 3,
    status: 'confirmed',
    total: 450000,
    createdAt: new Date('2024-09-22'),
  },
  {
    id: 7,
    cabinName: 'Refugio Cafetero',
    cabinLocation: 'Jardín, Antioquia',
    guestName: 'Roberto Vargas',
    guestEmail: 'roberto@email.com',
    guestPhone: '+57 300 777 8888',
    checkIn: new Date('2024-10-30'),
    checkOut: new Date('2024-11-02'),
    guests: 2,
    status: 'pending',
    total: 540000,
    createdAt: new Date('2024-09-25'),
  },
  {
    id: 8,
    cabinName: 'Cabaña Premium',
    cabinLocation: 'Rionegro, Antioquia',
    guestName: 'Sofía Ruiz',
    guestEmail: 'sofia@email.com',
    guestPhone: '+57 300 999 0000',
    checkIn: new Date('2024-12-15'),
    checkOut: new Date('2024-12-18'),
    guests: 6,
    status: 'confirmed',
    total: 525000,
    createdAt: new Date('2024-09-28'),
  },
  {
    id: 9,
    cabinName: 'Vista al Lago',
    cabinLocation: 'El Peñol, Antioquia',
    guestName: 'Miguel Ángel Pérez',
    guestEmail: 'miguel@email.com',
    guestPhone: '+57 300 111 3333',
    checkIn: new Date('2024-11-10'),
    checkOut: new Date('2024-11-13'),
    guests: 5,
    status: 'confirmed',
    total: 550000,
    createdAt: new Date('2024-10-01'),
  },
  {
    id: 10,
    cabinName: 'Cabaña del Bosque',
    cabinLocation: 'Guatapé, Antioquia',
    guestName: 'Isabella Castro',
    guestEmail: 'isabella@email.com',
    guestPhone: '+57 300 222 4444',
    checkIn: new Date('2024-12-20'),
    checkOut: new Date('2024-12-23'),
    guests: 4,
    status: 'pending',
    total: 450000,
    createdAt: new Date('2024-10-03'),
  },
  {
    id: 11,
    cabinName: 'Refugio Cafetero',
    cabinLocation: 'Jardín, Antioquia',
    guestName: 'Andrés Moreno',
    guestEmail: 'andres@email.com',
    guestPhone: '+57 300 444 5555',
    checkIn: new Date('2024-10-20'),
    checkOut: new Date('2024-10-22'),
    guests: 2,
    status: 'cancelled',
    total: 360000,
    createdAt: new Date('2024-09-10'),
  },
  {
    id: 12,
    cabinName: 'Cabaña Premium',
    cabinLocation: 'Rionegro, Antioquia',
    guestName: 'Valentina López',
    guestEmail: 'valentina@email.com',
    guestPhone: '+57 300 666 7777',
    checkIn: new Date('2024-11-25'),
    checkOut: new Date('2024-11-28'),
    guests: 7,
    status: 'confirmed',
    total: 525000,
    createdAt: new Date('2024-10-05'),
  },
  {
    id: 13,
    cabinName: 'Vista al Lago',
    cabinLocation: 'El Peñol, Antioquia',
    guestName: 'Daniel Herrera',
    guestEmail: 'daniel@email.com',
    guestPhone: '+57 300 888 9999',
    checkIn: new Date('2024-12-05'),
    checkOut: new Date('2024-12-08'),
    guests: 4,
    status: 'pending',
    total: 660000,
    createdAt: new Date('2024-10-08'),
  },
  {
    id: 14,
    cabinName: 'Cabaña del Bosque',
    cabinLocation: 'Guatapé, Antioquia',
    guestName: 'Camila Sánchez',
    guestEmail: 'camila@email.com',
    guestPhone: '+57 300 123 9876',
    checkIn: new Date('2024-11-15'),
    checkOut: new Date('2024-11-17'),
    guests: 3,
    status: 'confirmed',
    total: 300000,
    createdAt: new Date('2024-10-10'),
  },
  {
    id: 15,
    cabinName: 'Refugio Cafetero',
    cabinLocation: 'Jardín, Antioquia',
    guestName: 'Sebastián Rojas',
    guestEmail: 'sebastian@email.com',
    guestPhone: '+57 300 456 1234',
    checkIn: new Date('2024-12-10'),
    checkOut: new Date('2024-12-13'),
    guests: 2,
    status: 'confirmed',
    total: 540000,
    createdAt: new Date('2024-10-12'),
  },
  {
    id: 16,
    cabinName: 'Cabaña Premium',
    cabinLocation: 'Rionegro, Antioquia',
    guestName: 'Mariana Jiménez',
    guestEmail: 'mariana@email.com',
    guestPhone: '+57 300 789 4561',
    checkIn: new Date('2024-11-01'),
    checkOut: new Date('2024-11-04'),
    guests: 8,
    status: 'cancelled',
    total: 700000,
    createdAt: new Date('2024-09-05'),
  },
  {
    id: 17,
    cabinName: 'Vista al Lago',
    cabinLocation: 'El Peñol, Antioquia',
    guestName: 'Felipe Mendoza',
    guestEmail: 'felipe@email.com',
    guestPhone: '+57 300 321 6547',
    checkIn: new Date('2024-12-25'),
    checkOut: new Date('2024-12-28'),
    guests: 6,
    status: 'pending',
    total: 660000,
    createdAt: new Date('2024-10-15'),
  },
  {
    id: 18,
    cabinName: 'Cabaña del Bosque',
    cabinLocation: 'Guatapé, Antioquia',
    guestName: 'Gabriela Ortiz',
    guestEmail: 'gabriela@email.com',
    guestPhone: '+57 300 654 9871',
    checkIn: new Date('2024-11-12'),
    checkOut: new Date('2024-11-15'),
    guests: 4,
    status: 'confirmed',
    total: 450000,
    createdAt: new Date('2024-10-18'),
  },
  {
    id: 19,
    cabinName: 'Refugio Cafetero',
    cabinLocation: 'Jardín, Antioquia',
    guestName: 'Diego Navarro',
    guestEmail: 'diego@email.com',
    guestPhone: '+57 300 147 2583',
    checkIn: new Date('2024-10-28'),
    checkOut: new Date('2024-10-30'),
    guests: 2,
    status: 'confirmed',
    total: 360000,
    createdAt: new Date('2024-09-30'),
  },
  {
    id: 20,
    cabinName: 'Cabaña Premium',
    cabinLocation: 'Rionegro, Antioquia',
    guestName: 'Natalia Gómez',
    guestEmail: 'natalia@email.com',
    guestPhone: '+57 300 369 8520',
    checkIn: new Date('2024-12-30'),
    checkOut: new Date('2025-01-02'),
    guests: 7,
    status: 'pending',
    total: 525000,
    createdAt: new Date('2024-10-20'),
  },
  {
    id: 21,
    cabinName: 'Vista al Lago',
    cabinLocation: 'El Peñol, Antioquia',
    guestName: 'Alejandro Rivas',
    guestEmail: 'alejandro@email.com',
    guestPhone: '+57 300 741 9630',
    checkIn: new Date('2024-11-18'),
    checkOut: new Date('2024-11-21'),
    guests: 5,
    status: 'confirmed',
    total: 550000,
    createdAt: new Date('2024-10-22'),
  },
  {
    id: 22,
    cabinName: 'Cabaña del Bosque',
    cabinLocation: 'Guatapé, Antioquia',
    guestName: 'Carolina Parra',
    guestEmail: 'carolina@email.com',
    guestPhone: '+57 300 852 7410',
    checkIn: new Date('2024-12-08'),
    checkOut: new Date('2024-12-11'),
    guests: 3,
    status: 'confirmed',
    total: 450000,
    createdAt: new Date('2024-10-25'),
  },
];

export default function ReservationManagement() {
  const [reservations, setReservations] = useState(mockAdminReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleStatusChange = (reservationId: number, newStatus: string) => {
    setReservations(
      reservations.map((res) =>
        res.id === reservationId ? { ...res, status: newStatus } : res
      )
    );
    toast.success(`La reserva ha sido actualizada.`);
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.cabinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.guestEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || reservation.status === statusFilter;
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
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    cancelled: reservations.filter((r) => r.status === 'cancelled').length,
    totalRevenue: reservations
      .filter((r) => r.status === 'confirmed')
      .reduce((sum, r) => sum + r.total, 0),
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
