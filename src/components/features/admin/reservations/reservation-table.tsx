import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPrice } from '@/lib/helpers';
import { Reservation } from '@/types/reservation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Mail, MapPin, Phone } from 'lucide-react';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return (
        <Badge className='bg-green-500 hover:bg-green-600'>Confirmada</Badge>
      );
    case 'pending':
      return (
        <Badge className='bg-yellow-500 hover:bg-yellow-600'>Pendiente</Badge>
      );
    case 'cancelled':
      return <Badge variant='destructive'>Cancelada</Badge>;
    default:
      return <Badge variant='outline'>{status}</Badge>;
  }
};

type ReservationsTableProps = {
  reservations: Reservation[];
  onStatusChange: (reservationId: number, newStatus: string) => void;
};

export const ReservationsTable = ({
  reservations,
  onStatusChange,
}: ReservationsTableProps) => {
  if (reservations.length === 0) {
    return (
      <div className='text-center py-12'>
        <Calendar className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
        <h3 className='text-lg font-medium mb-2'>No se encontraron reservas</h3>
        <p className='text-muted-foreground'>
          No hay reservas que coincidan con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80px]'>ID</TableHead>
              <TableHead>Cabaña</TableHead>
              <TableHead>Huésped</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Fechas</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className='font-medium'>#{reservation.id}</TableCell>
                <TableCell>
                  <div>
                    <div className='font-medium'>{reservation.cabinName}</div>
                    <div className='text-sm text-muted-foreground flex items-center'>
                      <MapPin className='h-3 w-3 mr-1' />
                      {reservation.cabinLocation}
                    </div>
                  </div>
                </TableCell>
                <TableCell className='font-medium'>
                  {reservation.guestName}
                </TableCell>
                <TableCell>
                  <div className='space-y-1'>
                    <div className='flex items-center text-sm text-muted-foreground'>
                      <Mail className='h-3 w-3 mr-1' />
                      {reservation.guestEmail}
                    </div>
                    <div className='flex items-center text-sm text-muted-foreground'>
                      <Phone className='h-3 w-3 mr-1' />
                      {reservation.guestPhone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='text-sm'>
                    Entrada:{' '}
                    {format(reservation.checkIn, 'dd MMM yyyy', { locale: es })}
                  </div>
                  <div className='text-sm'>
                    Salida:{' '}
                    {format(reservation.checkOut, 'dd MMM yyyy', {
                      locale: es,
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className='font-bold text-cooprudea-teal'>
                    {formatPrice(reservation.total)}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell className='text-right'>
                  <Select
                    value={reservation.status}
                    onValueChange={(value) =>
                      onStatusChange(reservation.id, value)
                    }
                  >
                    <SelectTrigger className='w-[130px]'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='pending'>Pendiente</SelectItem>
                      <SelectItem value='confirmed'>Confirmar</SelectItem>
                      <SelectItem value='cancelled'>Cancelar</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
