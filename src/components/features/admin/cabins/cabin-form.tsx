import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Cabin, CabinFormData } from '@/types/cabin';
import { useState, useEffect } from 'react';

type CabinFormProps = {
  initialData: Cabin | null;
  onSubmit: (formData: CabinFormData) => void;
  onCancel: () => void;
};

const emptyForm: CabinFormData = {
  name: '',
  description: '',
  capacity: '',
  bedrooms: '',
  bathrooms: '',
  basePrice: '',
  maxGuests: '',
  active: true,
  locationAddress: '',
  locationZone: '',
  locationLat: '',
  locationLng: '',
  amenities: '',
};

export const CabinForm = ({
  initialData,
  onSubmit,
  onCancel,
}: CabinFormProps) => {
  const [formData, setFormData] = useState<CabinFormData>(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        active: initialData.active,
        capacity: initialData.capacity.toString(),
        bedrooms: initialData.bedrooms.toString(),
        bathrooms: initialData.bathrooms.toString(),
        basePrice: initialData.basePrice.toString(),
        maxGuests: initialData.maxGuests.toString(),
        amenities: initialData.amenities.amenities.join(', '),
        locationAddress: initialData.location.address,
        locationZone: initialData.location.zone,
        locationLat: initialData.location.coordinates.lat.toString(),
        locationLng: initialData.location.coordinates.lng.toString(),
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData((prev) => ({
      ...prev,
      [id]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Nombre</Label>
          <Input
            id='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='location'>Ubicación</Label>
          <Input
            id='locationAddress'
            value={formData.locationAddress}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='description'>Descripción</Label>
        <Textarea
          id='description'
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='price'>Precio por noche (COP)</Label>
          <Input
            id='basePrice'
            type='number'
            value={formData.basePrice}
            onChange={handleChange}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='capacity'>Capacidad (personas)</Label>
          <Input
            id='capacity'
            type='number'
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='amenities'>Comodidades (separadas por coma)</Label>
        <Input
          id='amenities'
          value={formData.amenities}
          onChange={handleChange}
          placeholder='WiFi, Cocina, Chimenea'
          required
        />
      </div>
      <div className='flex items-center space-x-2'>
        <input
          type='checkbox'
          id='active'
          checked={formData.active}
          onChange={handleChange}
        />
        <Label htmlFor='active'>Disponible para reservas</Label>
      </div>
      <div className='flex justify-end space-x-2 pt-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type='submit'
          className='bg-primary-green hover:bg-primary-green/90 text-white'
        >
          {initialData ? 'Actualizar' : 'Crear'} Cabaña
        </Button>
      </div>
    </form>
  );
};
