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
import { format, startOfMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { Value } from 'react-calendar/dist/shared/types.js';
import toast from 'react-hot-toast';
import { getUserId } from '@/lib/auth';
import Cookies from 'js-cookie';
import { useCreateReservation } from '@/hooks/useReservations';

type CabinDetailCalendarProps = {
  cabin: Cabin;
};

export const CabinDetailSidebar = ({ cabin }: CabinDetailCalendarProps) => {
  const [availabilityMap, setAvailabilityMap] = useState<AvailabilityMap>({});
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [isReserving, setIsReserving] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const createReservationMutation = useCreateReservation();

  useEffect(() => {
    const fetchAvailability = async () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const currentMap = await getMonthlyAvailability(cabin.id, year, month);

      const prevMonth = subMonths(currentMonth, 1);
      const prevYear = prevMonth.getFullYear();
      const prevMonthNum = prevMonth.getMonth() + 1;
      const prevMap = await getMonthlyAvailability(
        cabin.id,
        prevYear,
        prevMonthNum
      );

      const nextMonth = addMonths(currentMonth, 1);
      const nextYear = nextMonth.getFullYear();
      const nextMonthNum = nextMonth.getMonth() + 1;
      const nextMap = await getMonthlyAvailability(
        cabin.id,
        nextYear,
        nextMonthNum
      );

      const combinedMap = { ...prevMap, ...currentMap, ...nextMap };
      setAvailabilityMap(combinedMap);
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

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      const date = value;

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
    }
  };

  const handleReservation = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Por favor selecciona las fechas de entrada y salida');
      return;
    }

    const token = Cookies.get('accessToken');
    if (!token) {
      toast.error('Debes iniciar sesión para hacer una reserva');
      router.push('/login');
      return;
    }

    const userId = getUserId(token);
    if (!userId) {
      toast.error('Error al obtener información del usuario');
      return;
    }

    setIsReserving(true);

    createReservationMutation.mutate(
      {
        userId,
        cabinId: cabin.id,
        startDate: format(checkIn, 'yyyy-MM-dd'),
        endDate: format(checkOut, 'yyyy-MM-dd'),
        guests: cabin.capacity,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setIsReserving(false);
          setTimeout(() => {
            router.push('/reservations');
          }, 500);
        },
        onError: (error) => {
          toast.error((error as Error).message || 'Error al crear la reserva');
          setIsReserving(false);
        },
      }
    );
  };

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

        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <AlertDialogTrigger asChild>
            <Button
              disabled={!checkIn || !checkOut || isReserving}
              className='w-full bg-primary-green hover:bg-primary-green/90 cursor-pointer text-white shadow-lg transition-all duration-150 transform hover:scale-[1.01]'
            >
              {isReserving ? 'Procesando...' : 'Reservar Ahora'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Confirmar tu reserva?</AlertDialogTitle>
              <AlertDialogDescription>
                <div className='space-y-2 mt-4 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Cabaña:</span>
                    <span className='font-semibold'>{cabin.name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Entrada:</span>
                    <span className='font-semibold'>
                      {checkIn && format(checkIn, 'PPP', { locale: es })}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Salida:</span>
                    <span className='font-semibold'>
                      {checkOut && format(checkOut, 'PPP', { locale: es })}
                    </span>
                  </div>
                  <div className='flex justify-between border-t pt-2 mt-2'>
                    <span className='text-muted-foreground'>
                      Total a pagar:
                    </span>
                    <span className='font-bold text-lg'>
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='cursor-pointer transition-all duration-150 transform hover:scale-[1.01]'>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReservation}
                className='bg-primary-green hover:bg-primary-green/90 cursor-pointer text-white shadow-lg transition-all duration-150 transform hover:scale-[1.01]'
              >
                Confirmar y Reservar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
