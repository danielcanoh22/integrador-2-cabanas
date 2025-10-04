import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/helpers';
import { Cabin } from '@/types/cabin';
import { MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type CabinCardProps = {
  cabin: Cabin;
};

export const CabinCard = ({ cabin }: CabinCardProps) => {
  return (
    <Card
      key={cabin.id}
      className='overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-96 w-full py-0 pb-4 mx-auto md:mx-0'
    >
      <div className='relative'>
        <Image
          src='/assets/image/cabin-1.jpg'
          alt={cabin.name}
          width={400}
          height={300}
          className='w-full h-48 object-cover'
        />
        <div className='absolute top-4 right-4'>
          <Badge
            variant='secondary'
            className={`text-white ${
              cabin.active ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {cabin.active ? 'Disponible' : 'No disponible'}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <CardTitle className='text-lg'>{cabin.name}</CardTitle>
        <CardDescription className='text-sm'>
          {cabin.description}
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex items-center text-sm text-muted-foreground'>
          <MapPin className='h-4 w-4 mr-1' />
          {cabin.location.address}
        </div>

        <div className='flex items-center text-sm text-muted-foreground'>
          <Users className='h-4 w-4 mr-1' />
          Hasta {cabin.capacity} personas
        </div>

        <div className='text-xl font-bold text-cooprudea-teal'>
          {formatPrice(cabin.basePrice)}
          <span className='text-sm font-normal text-muted-foreground'>
            /noche
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          asChild
          className='w-full bg-primary-green dark:text-white hover:bg-primary-green/80'
        >
          <Link href={`/cabins/${cabin.id}`}>Ver Detalles y Reservar</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
