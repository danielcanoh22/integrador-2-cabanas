import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/helpers';
import { type Cabin } from '@/types/cabin';
import { DollarSign, Edit, MapPin, Trash2, Users } from 'lucide-react';
import Image from 'next/image';

type CabinCardProps = {
  cabin: Cabin;
  onToggleAvailability: (id: number) => void;
  onEdit: (cabin: Cabin) => void;
  onDelete: (id: number) => void;
};

export const CabinCard = ({
  cabin,
  onToggleAvailability,
  onEdit,
  onDelete,
}: CabinCardProps) => {
  return (
    <Card className='overflow-hidden pt-0'>
      <div className='relative'>
        <Image
          src='/assets/image/cabin-1.jpg'
          alt={cabin.name}
          width={800}
          height={600}
          className='w-full h-48 object-cover'
        />
        <div className='absolute top-4 right-4'>
          <Badge
            variant={cabin.active ? 'default' : 'destructive'}
            className={cabin.active ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            {cabin.active ? 'Activa' : 'Inactiva'}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <CardTitle className='text-lg'>{cabin.name}</CardTitle>
        <CardDescription className='text-sm'>
          {cabin.description}
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-3'>
        <div className='flex items-center text-sm text-muted-foreground'>
          <MapPin className='h-4 w-4 mr-1' />
          {cabin.location.address}
        </div>
        <div className='flex items-center justify-between text-sm'>
          <div className='flex items-center text-muted-foreground'>
            <Users className='h-4 w-4 mr-1' /> {cabin.capacity} personas
          </div>
          <div className='flex items-center font-bold text-cooprudea-teal'>
            <DollarSign className='h-4 w-4 mr-1' />
            {formatPrice(cabin.basePrice)}
          </div>
        </div>
        <div className='flex flex-wrap gap-1 mb-3'>
          {(cabin.amenities as string[]).slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant='outline' className='text-xs'>
              {amenity}
            </Badge>
          ))}
          {cabin.amenities.length > 3 && (
            <Badge variant='outline' className='text-xs'>
              +{cabin.amenities.length - 3} más
            </Badge>
          )}
        </div>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onToggleAvailability(cabin.id)}
            className='flex-1 cursor-pointer'
          >
            {cabin.active ? 'Marcar inactiva' : 'Marcar activa'}
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onEdit(cabin)}
            className='cursor-pointer'
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onDelete(cabin.id)}
            className='text-red-600 hover:text-red-700 cursor-pointer'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
