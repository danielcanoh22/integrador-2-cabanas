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
  locationAddress: '',
  amenities: '',
  defaultCheckInTime: '15:00',
  defaultCheckOutTime: '11:00',
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
        capacity: initialData.maxGuests.toString(),
        maxGuests: initialData.maxGuests.toString(),
        bedrooms: initialData.bedrooms.toString(),
        bathrooms: initialData.bathrooms.toString(),
        basePrice: initialData.basePrice.toString(),
        amenities: initialData.amenities.join(', '),
        locationAddress: initialData.location.address || '',
        defaultCheckInTime: initialData.defaultCheckInTime || '15:00',
        defaultCheckOutTime: initialData.defaultCheckOutTime || '11:00',
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
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
          <Label htmlFor='locationAddress'>Dirección</Label>
          <Input
            id='locationAddress'
            value={formData.locationAddress}
            onChange={handleChange}
            required
            placeholder='Ej: Vereda La Clarita, Finca #3'
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
          className='resize-none max-w-[462px]'
        />
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='maxGuests'>Capacidad Max.</Label>
          <Input
            id='maxGuests'
            type='number'
            value={formData.maxGuests}
            onChange={handleChange}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='bedrooms'>Nº Dormitorios</Label>
          <Input
            id='bedrooms'
            type='number'
            value={formData.bedrooms}
            onChange={handleChange}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='bathrooms'>Nº Baños</Label>
          <Input
            id='bathrooms'
            type='number'
            value={formData.bathrooms}
            onChange={handleChange}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='basePrice'>Precio</Label>
          <Input
            id='basePrice'
            type='number'
            value={formData.basePrice}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='amenities'>Comodidades (separadas por coma)</Label>
        <Textarea
          id='amenities'
          value={formData.amenities}
          onChange={handleChange}
          placeholder='WiFi, Cocina, Parqueadero...'
          required
          className='resize-none max-w-[462px]'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='defaultCheckInTime'>Hora Check-In (HH:MM)</Label>
          <Input
            id='defaultCheckInTime'
            type='time'
            value={formData.defaultCheckInTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='defaultCheckOutTime'>Hora Check-Out (HH:MM)</Label>
          <Input
            id='defaultCheckOutTime'
            type='time'
            value={formData.defaultCheckOutTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className='flex justify-end space-x-2 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          className='cursor-pointer'
        >
          Cancelar
        </Button>
        <Button
          type='submit'
          className='bg-primary-green hover:bg-primary-green/90 text-white cursor-pointer'
        >
          {initialData ? 'Actualizar Cabaña' : 'Crear Cabaña'}
        </Button>
      </div>
    </form>
  );
};
