import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/helpers';
import { getMonthlyAvailability } from '@/services/availability';
import { AvailabilityMap } from '@/types/availability';
import { Cabin } from '@/types/cabin';
import { format, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';

type CabinDetailCalendarProps = {
  cabin: Cabin;
};

// TODO: Solucionar errores de tipado cuando se arregle
// el endpoint de availability
export const CabinDetailSidebar = ({ cabin }: CabinDetailCalendarProps) => {
  const [availabilityMap, setAvailabilityMap] = useState<AvailabilityMap[]>([]);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [isReserving, setIsReserving] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const newMap = await getMonthlyAvailability(cabin.id, year, month);
      setAvailabilityMap(newMap);
    };

    fetchAvailability();
  }, [cabin.id, currentMonth]);

  const handleMonthChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => {
    if (activeStartDate) {
      setCurrentMonth(startOfMonth(activeStartDate));
    }
  };

  const handleDateChange = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    if (availabilityMap[dateString] === false) {
      return;
    }

    if (!isSelectingCheckOut) {
      setCheckIn(date);
      setCheckOut(undefined);
      setIsSelectingCheckOut(true);
      return;
    }

    if (isSelectingCheckOut) {
      if (checkIn && date <= checkIn) {
        setCheckIn(date);
        setCheckOut(undefined);
        return;
      }

      const start = new Date(checkIn!);
      start.setDate(start.getDate() + 1);

      while (start < date) {
        const loopDateString = format(start, 'yyyy-MM-dd');
        if (availabilityMap[loopDateString] === false) {
          setCheckIn(undefined);
          setCheckOut(undefined);
          setIsSelectingCheckOut(false);
          return;
        }
        start.setDate(start.getDate() + 1);
      }

      setCheckOut(date);
      setIsSelectingCheckOut(false);
    }
  };

  const handleReservation = () => {};

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const baseClass = 'calendar-tile';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return `${baseClass} calendar-tile-disabled`;
    }

    const dateString = format(date, 'yyyy-MM-dd');
    if (availabilityMap[dateString] === false) {
      return `${baseClass} calendar-tile-occupied`;
    }

    const isCheckIn = checkIn && date.toDateString() === checkIn.toDateString();
    const isCheckOut =
      checkOut && date.toDateString() === checkOut.toDateString();
    const isInRange = checkIn && checkOut && date > checkIn && date < checkOut;

    if (isCheckIn) {
      if (isCheckOut) {
        return `${baseClass} calendar-tile-single-day`;
      }
      return `${baseClass} calendar-tile-checkin`;
    }

    if (isCheckOut) {
      return `${baseClass} calendar-tile-checkout`;
    }

    if (isInRange) {
      return `${baseClass} calendar-tile-range`;
    }

    return `${baseClass} calendar-tile-available`;
  };

  const isDateDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    const dateString = format(date, 'yyyy-MM-dd');
    return availabilityMap[dateString] === false;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    return cabin.basePrice * calculateNights();
  };

  return (
    <Card className='sticky top-24'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>{formatPrice(cabin.basePrice)}</span>
          <div className='flex items-center text-sm text-muted-foreground'>
            <Users className='h-4 w-4 mr-1' />
            {cabin.capacity} personas
          </div>
        </CardTitle>
        <CardDescription>por noche</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-cooprudea-teal'>
              Selecciona tus fechas
            </h3>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                setCheckIn(undefined);
                setCheckOut(undefined);
                setIsSelectingCheckOut(false);
              }}
              className='text-muted-foreground hover:text-primary-green cursor-pointer'
            >
              Limpiar
            </Button>
          </div>

          <div className='bg-gray-50 dark:bg-[#212121] p-4 rounded-lg'>
            <Calendar
              onChange={handleDateChange}
              value={checkIn}
              onActiveStartDateChange={handleMonthChange}
              tileClassName={tileClassName}
              tileDisabled={isDateDisabled}
              minDate={new Date()}
              className='custom-calendar'
              locale='es-ES'
            />
          </div>

          {/* Legend */}
          <div className='grid grid-cols-2 gap-2 text-xs'>
            <div className='flex items-center justify-center gap-2'>
              <div className='w-3 h-3 rounded bg-gray-200'></div>
              <span>Disponible</span>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <div className='w-3 h-3 rounded bg-red-500/70'></div>
              <span>Ocupado</span>
            </div>
          </div>

          {/* Selected dates display */}
          {checkIn && (
            <div className='space-y-2 p-4 bg-white/50 dark:bg-[#212121] dark:border-0 rounded-lg border border-cooprudea-teal/20'>
              <div className='flex items-center justify-between text-sm'>
                <span className='font-medium'>Entrada:</span>
                <span className='text-cooprudea-teal font-semibold'>
                  {format(checkIn, 'PPP', { locale: es })}
                </span>
              </div>
              {checkOut && (
                <div className='flex items-center justify-between text-sm'>
                  <span className='font-medium'>Salida:</span>
                  <span className='text-cooprudea-pink font-semibold'>
                    {format(checkOut, 'PPP', { locale: es })}
                  </span>
                </div>
              )}
              {!checkOut && isSelectingCheckOut && (
                <div className='text-sm text-muted-foreground text-center py-2'>
                  Ahora selecciona la fecha de salida
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price breakdown */}
        {checkIn && checkOut && (
          <div className='space-y-2 pt-4 border-t'>
            <div className='flex justify-between text-sm'>
              <span>
                {formatPrice(cabin.basePrice)} x {calculateNights()} noches
              </span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
            <div className='flex justify-between font-bold text-lg'>
              <span>Total</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleReservation}
          disabled={!checkIn || !checkOut || isReserving}
          className='w-full bg-primary-green hover:bg-primary-green/90 cursor-pointer text-white shadow-lg transition-all duration-150 transform hover:scale-[1.01]'
        >
          {isReserving ? 'Procesando...' : 'Reservar Ahora'}
        </Button>
      </CardContent>
    </Card>
  );
};
