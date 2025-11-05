'use client';

import { CabinCard } from '@/components/features/admin/cabins/cabin-card';
import { CabinForm } from '@/components/features/admin/cabins/cabin-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  createCabin,
  deleteCabin,
  getAllAdminCabins,
  updateCabin,
} from '@/services/cabins-admin';
import { Cabin, CabinFormData, CabinPayload } from '@/types/cabin';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function CabinsManagement() {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCabin, setEditingCabin] = useState<Cabin | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [cabinToDelete, setCabinToDelete] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCabins = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllAdminCabins();
        setCabins(data);
      } catch (err) {
        setError((err as Error).message);
        toast.error('No se pudieron cargar las cabañas.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCabins();
  }, []);

  const handleSubmit = async (formData: CabinFormData) => {
    const payload: CabinPayload = {
      name: formData.name,
      description: formData.description,
      capacity: parseInt(formData.maxGuests, 10),
      bedrooms: parseInt(formData.bedrooms, 10),
      bathrooms: parseInt(formData.bathrooms, 10),
      basePrice: parseInt(formData.basePrice, 10),
      maxGuests: parseInt(formData.maxGuests, 10),
      amenities: JSON.stringify(
        formData.amenities.split(',').map((a) => a.trim())
      ),
      location: JSON.stringify({
        address: formData.locationAddress,
        coordinates: {
          lat: 0,
          lng: 0,
        },
        zone: '',
      }),
      defaultCheckInTime: formData.defaultCheckInTime || '15:00',
      defaultCheckOutTime: formData.defaultCheckOutTime || '11:00',
    };

    console.log(payload);

    if (editingCabin) {
      const updatedCabin = await updateCabin(editingCabin.id, payload);

      setCabins(
        cabins.map((c) =>
          c.id === updatedCabin.id
            ? {
                ...updatedCabin,
                amenities: updatedCabin.amenities,
                location: updatedCabin.location,
              }
            : c
        )
      );
      toast.success('Cabaña actualizada con éxito');
    } else {
      const newCabin = await createCabin(payload);
      setCabins((prev) => [
        ...prev,
        {
          ...newCabin,
          amenities: newCabin.amenities,
          location: newCabin.location,
        },
      ]);
      toast.success('Cabaña creada con éxito');
    }

    closeDialog();
  };

  const handleEdit = (cabin: Cabin) => {
    setEditingCabin(cabin);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!cabinToDelete) return;

    try {
      await deleteCabin(cabinToDelete);

      setCabins((prevCabins) =>
        prevCabins.filter((cabin) => cabin.id !== cabinToDelete)
      );

      toast.success('La cabaña ha sido eliminada');
    } catch (error) {
      toast.error((error as Error).message || 'No se pudo eliminar la cabaña.');
    } finally {
      setIsAlertOpen(false);
      setCabinToDelete(null);
    }
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

  const openDeleteDialog = (id: number) => {
    setCabinToDelete(id);
    setIsAlertOpen(true);
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

      {isLoading ? (
        <div className='text-center py-12'>Cargando cabañas...</div>
      ) : error ? (
        <div className='text-center py-12 text-red-600'>
          <p>Error al cargar los datos</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {cabins.map((cabin) => (
            <CabinCard
              key={cabin.id}
              cabin={cabin}
              onEdit={handleEdit}
              onDelete={openDeleteDialog}
              onToggleAvailability={toggleAvailability}
            />
          ))}
        </div>
      )}

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              la cabaña de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setCabinToDelete(null)}
              className='cursor-pointer'
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className='bg-destructive hover:bg-destructive/90 text-white cursor-pointer'
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
