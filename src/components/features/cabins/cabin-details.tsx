'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import Image from 'next/image';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Cabin } from '@/types/cabin';
import { CabinDetailSidebar } from './cabin-detail-sidebar';

type CabinDetailsProps = {
  cabin: Cabin;
};

export const CabinDetails = ({ cabin }: CabinDetailsProps) => {
  // const { toast } = useToast();

  if (!cabin) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>Cabaña no encontrada</h2>
          {/* <Button onClick={() => navigate('/')}>Volver a Cabañas</Button> */}
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <Link
        href='/cabins'
        className='mb-6 flex items-center gap-2 hover:bg-muted text-muted-foreground hover:text-foreground w-max py-2 px-3 rounded-lg'
      >
        <ArrowLeft className='h-4 w-4' />
        <span>Volver a Cabañas</span>
      </Link>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-8'>
          <div className='relative group overflow-hidden rounded-2xl shadow-cabin-card'>
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10'></div>
            <Image
              src='/assets/image/cabin-1.jpg'
              alt={cabin.name}
              width={400}
              height={300}
              className='w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105'
            />
            <div className='absolute top-6 right-6 z-20'>
              <Badge
                variant='secondary'
                className={`text-white text-sm ${
                  cabin.active ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {cabin.active ? 'Disponible' : 'No disponible'}
              </Badge>
            </div>
            <div className='absolute bottom-6 left-6 z-20 text-white'>
              <h1 className='text-4xl font-bold mb-2 drop-shadow-lg'>
                {cabin.name}
              </h1>
              <div className='flex items-center text-white/90 text-lg'>
                <MapPin className='h-5 w-5 mr-2' />
                {cabin.location.address}
              </div>
            </div>
          </div>

          <div>
            <p className='text-lg text-muted-foreground'>{cabin.description}</p>
          </div>

          <Card className='border-0 shadow-soft overflow-hidden pt-0'>
            <CardHeader className='bg-primary-purple/10 py-6'>
              <CardTitle className='text-2xl flex items-center text-primary-purple'>
                <Star className='h-6 w-6 mr-3' />
                Características Destacadas
              </CardTitle>
            </CardHeader>
            <CardContent className='p-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* {cabin.features.map((feature, index) => (
                  <div
                    key={index}
                    className='group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-purple/10 hover:to-transparent transition-all duration-300'
                  >
                    <div className='w-3 h-3 rounded-full bg-gradient-to-r from-primary-purple/80 to-primary-pink/80 mt-2 flex-shrink-0 shadow-sm group-hover:scale-125 transition-transform duration-200'></div>
                    <span className='text-gray-500 text-lg leading-relaxed group-hover:text-primary-purple transition-colors duration-300'>
                      {feature}
                    </span>
                  </div>
                ))} */}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='lg:col-span-1'>
          <CabinDetailSidebar cabin={cabin} />
        </div>
      </div>
    </div>
  );
};
