'use client';

import { CabinCard } from '@/components/features/admin/cabins/cabin-card';
import { CabinForm } from '@/components/features/admin/cabins/cabin-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Cabin, CabinFormData } from '@/types/cabin';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const mockCabins: Cabin[] = [
  {
    id: 1,
    name: 'Cabaña del Bosque',
    description:
      'Acogedora cabaña rodeada de naturaleza, perfecta para el descanso familiar.',
    // image: '/assets/image/cabin-1.jpg',
    basePrice: 150000,
    capacity: 6,
    location: {
      address: 'Calle 0 #0-0',
      coordinates: {
        lat: -5,
        lng: 5,
      },
      zone: 'Guatapé, Antioquia',
    },
    amenities: {
      amenities: ['WiFi', 'Cocina', 'Chimenea', 'Parqueadero'],
    },
    active: true,
    bathrooms: 2,
    bedrooms: 4,
    maxGuests: 10,
  },

  {
    id: 2,
    name: 'Cabaña del Bosque',
    description:
      'Acogedora cabaña rodeada de naturaleza, perfecta para el descanso familiar.',
    // image: '/assets/image/cabin-1.jpg',
    basePrice: 150000,
    capacity: 6,
    location: {
      address: 'Calle 0 #0-0',
      coordinates: {
        lat: -5,
        lng: 5,
      },
      zone: 'Guatapé, Antioquia',
    },
    amenities: {
      amenities: ['WiFi', 'Cocina', 'Chimenea', 'Parqueadero'],
    },
    active: true,
    bathrooms: 2,
    bedrooms: 4,
    maxGuests: 10,
  },
  {
    id: 3,
    name: 'Cabaña del Bosque',
    description:
      'Acogedora cabaña rodeada de naturaleza, perfecta para el descanso familiar.',
    // image: '/assets/image/cabin-1.jpg',
    basePrice: 150000,
    capacity: 6,
    location: {
      address: 'Calle 0 #0-0',
      coordinates: {
        lat: -5,
        lng: 5,
      },
      zone: 'Guatapé, Antioquia',
    },
    amenities: {
      amenities: ['WiFi', 'Cocina', 'Chimenea', 'Parqueadero'],
    },
    active: true,
    bathrooms: 2,
    bedrooms: 4,
    maxGuests: 10,
  },
];

export default function CabinsManagement() {
  const [cabins, setCabins] = useState<Cabin[]>(mockCabins);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCabin, setEditingCabin] = useState<Cabin | null>(null);

  const handleSubmit = (formData: CabinFormData) => {
    const processedDataForCabin = {
      name: formData.name,
      description: formData.description,
      active: formData.active,
      capacity: parseInt(formData.capacity, 10),
      bedrooms: parseInt(formData.bedrooms, 10),
      bathrooms: parseInt(formData.bathrooms, 10),
      basePrice: parseInt(formData.basePrice, 10),
      maxGuests: parseInt(formData.maxGuests, 10),
      amenities: {
        amenities: formData.amenities.split(',').map((a) => a.trim()),
      },
      location: {
        address: formData.locationAddress,
        zone: formData.locationZone,
        coordinates: {
          lat: parseFloat(formData.locationLat),
          lng: parseFloat(formData.locationLng),
        },
      },
    };

    if (editingCabin) {
      const updatedCabin: Cabin = {
        ...editingCabin,
        ...processedDataForCabin,
      };
      setCabins(
        cabins.map((c) => (c.id === updatedCabin.id ? updatedCabin : c))
      );
      toast.success('Cabaña actualizada');
    } else {
      const newCabin: Cabin = {
        id: Math.random(),
        ...processedDataForCabin,
      };
      setCabins((prev) => [...prev, newCabin]);
      toast.success('Cabaña creada');
    }

    closeDialog();
  };

  const handleEdit = (cabin: Cabin) => {
    setEditingCabin(cabin);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCabins(cabins.filter((cabin) => cabin.id !== id));
    toast.success('La cabaña ha sido eliminada');
  };

  const toggleAvailability = (id: number) => {
    setCabins(
      cabins.map((cabin) =>
        cabin.id === id ? { ...cabin, active: !cabin.active } : cabin
      )
    );
    toast.success('El estado de disponibilidad ha sido actualizado');
  };

  const openNewCabinDialog = () => {
    setEditingCabin(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCabin(null);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-primary-blue'>
            Administrar Cabañas
          </h1>
          <p className='text-muted-foreground'>
            Gestiona todas las cabañas del sistema
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNewCabinDialog}
              className='bg-primary-green hover:bg-primary-green/90 text-white cursor-pointer'
            >
              <Plus className='h-4 w-4 mr-2' /> Nueva Cabaña
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>
                {editingCabin ? 'Editar Cabaña' : 'Nueva Cabaña'}
              </DialogTitle>
              <DialogDescription>
                {editingCabin
                  ? 'Actualiza la información de la cabaña'
                  : 'Agrega una nueva cabaña al sistema'}
              </DialogDescription>
            </DialogHeader>
            <CabinForm
              initialData={editingCabin}
              onSubmit={handleSubmit}
              onCancel={closeDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {cabins.map((cabin) => (
          <CabinCard
            key={cabin.id}
            cabin={cabin}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleAvailability={toggleAvailability}
          />
        ))}
      </div>
    </div>
  );
}
