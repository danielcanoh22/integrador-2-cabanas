'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatPrice } from '@/lib/helpers';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { EnrichedReservation } from '@/types/reservation';

interface ReservationCardProps {
  reservation: EnrichedReservation;
  onCancel: (reservationId: number) => Promise<void>;
}

export const ReservationCard = ({
  reservation,
  onCancel,
}: ReservationCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const badgeColor =
    reservation.status === 'CONFIRMED'
      ? 'bg-green-600'
      : reservation.status === 'PENDING'
      ? 'bg-yellow-600'
      : 'bg-red-600';

  const statusText =
    reservation.status === 'CONFIRMED'
      ? 'Confirmada'
      : reservation.status === 'PENDING'
      ? 'Pendiente'
      : 'Cancelada';

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await onCancel(reservation.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      key={reservation.id}
      className={`overflow-hidden lg:max-w-80 w-full pt-0 ${
        reservation.status === 'CANCELLED' ? 'opacity-75' : ''
      }`}
    >
      <div className='relative'>
        <Image
          src='/assets/image/cabin-1.jpg'
          alt='Cabaña'
          width={400}
          height={300}
          className={`w-full h-32 object-cover ${
            reservation.status === 'CANCELLED' ? 'grayscale' : ''
          }`}
        />
        <div className='absolute top-2 right-2'>
          <Badge
            variant='secondary'
            className={`text-white text-sm capitalize ${badgeColor}`}
          >
            {statusText}
          </Badge>
        </div>
      </div>

      <CardHeader className='pb-3'>
        <CardTitle className='text-lg'>{reservation.cabin.name}</CardTitle>
        <CardDescription className='flex items-center'>
          <MapPin className='h-3 w-3 mr-1' />
          {reservation.cabin.location.address}
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-3 flex flex-col'>
        <div className='flex items-center text-sm text-muted-foreground'>
          <Calendar className='h-4 w-4 mr-2' />
          <div>
            <div>
              {format(new Date(reservation.startDate), 'dd MMM', {
                locale: es,
              })}{' '}
              -{' '}
              {format(new Date(reservation.endDate), 'dd MMM yyyy', {
                locale: es,
              })}
            </div>
          </div>
        </div>

        <div className='flex items-center text-sm text-muted-foreground'>
          <Clock className='h-4 w-4 mr-2' />
          <div>
            <div>
              Check-in:{' '}
              {reservation.checkInTime || reservation.cabin.defaultCheckInTime}
              {' • '}
              Check-out:{' '}
              {reservation.checkOutTime ||
                reservation.cabin.defaultCheckOutTime}
            </div>
          </div>
        </div>

        <div className='flex items-center text-sm text-muted-foreground'>
          <Users className='h-4 w-4 mr-2' />
          {reservation.guests} huéspedes
        </div>

        <div className='text-lg font-bold text-muted-foreground'>
          {formatPrice(reservation.finalPrice || reservation.total || 0)}
        </div>

        {reservation.status !== 'CANCELLED' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className='self-end cursor-pointer bg-primary-purple dark:text-white hover:bg-primary-purple/90'
                disabled={isLoading}
              >
                {isLoading ? 'Cancelando...' : 'Cancelar Reserva'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Cancelar reserva?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La reserva será cancelada
                  permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='cursor-pointer'>
                  Mantener reserva
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  className='bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                >
                  Sí, cancelar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
};
