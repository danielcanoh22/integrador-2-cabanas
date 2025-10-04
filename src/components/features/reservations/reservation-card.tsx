import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/helpers';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

// TODO: Crear el tipo Reservation.
export const ReservationCard = ({ reservation }) => {
  const badgeColor =
    reservation.status === 'confirmada'
      ? 'bg-green-600'
      : reservation.status === 'pendiente'
      ? 'bg-yellow-600'
      : 'bg-red-600';

  return (
    <Card
      key={reservation.id}
      className={`overflow-hidden lg:max-w-80 w-full pt-0 ${
        reservation.status === 'cancelada' ? 'opacity-75' : ''
      }`}
    >
      <div className='relative'>
        <Image
          src={reservation.cabinImage}
          alt={reservation.cabinName}
          width={400}
          height={300}
          className={`w-full h-32 object-cover ${
            reservation.status === 'cancelada' ? 'grayscale' : ''
          }`}
        />
        <div className='absolute top-2 right-2'>
          <Badge
            variant='secondary'
            className={`text-white text-sm capitalize ${badgeColor}`}
          >
            {reservation.status}
          </Badge>
        </div>
      </div>

      <CardHeader className='pb-3'>
        <CardTitle className='text-lg'>{reservation.cabinName}</CardTitle>
        <CardDescription className='flex items-center'>
          <MapPin className='h-3 w-3 mr-1' />
          {reservation.location}
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-3 flex flex-col'>
        <div className='flex items-center text-sm text-muted-foreground'>
          <Calendar className='h-4 w-4 mr-2' />
          <div>
            <div>
              {format(reservation.checkIn, 'dd MMM', { locale: es })} -{' '}
              {format(reservation.checkOut, 'dd MMM yyyy', { locale: es })}
            </div>
          </div>
        </div>

        <div className='flex items-center text-sm text-muted-foreground'>
          <Users className='h-4 w-4 mr-2' />
          {reservation.guests} huéspedes
        </div>

        <div className='text-lg font-bold text-muted-foreground'>
          {formatPrice(reservation.total)}
        </div>

        {reservation.status !== 'cancelada' && (
          <Button className='self-end cursor-pointer bg-primary-purple dark:text-white hover:bg-primary-purple/90'>
            Cancelar Reserva
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
