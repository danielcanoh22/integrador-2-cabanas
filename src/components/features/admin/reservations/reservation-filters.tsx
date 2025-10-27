import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';

type ReservationFiltersProps = {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
};

export const ReservationFilters = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: ReservationFiltersProps) => (
  <div className='flex flex-col sm:flex-row gap-4 mb-6'>
    <div className='relative flex-1'>
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
      <Input
        placeholder='Buscar por huésped, cabaña o email...'
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className='pl-10'
      />
    </div>
    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
      <SelectTrigger className='w-full sm:w-48'>
        <Filter className='h-4 w-4 mr-2' />
        <SelectValue placeholder='Filtrar por estado' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>Todos los estados</SelectItem>
        <SelectItem value='confirmed'>Confirmadas</SelectItem>
        <SelectItem value='pending'>Pendientes</SelectItem>
        <SelectItem value='cancelled'>Canceladas</SelectItem>
      </SelectContent>
    </Select>
  </div>
);
