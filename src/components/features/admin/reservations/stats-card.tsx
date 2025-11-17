import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/helpers';

type Stats = {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  totalRevenue: number;
};

export const StatsCards = ({ stats }: { stats: Stats }) => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8'>
    <StatCard
      title='Total Reservas'
      value={stats.total}
      color='text-cooprudea-teal'
    />
    <StatCard
      title='Confirmadas'
      value={stats.confirmed}
      color='text-green-600'
    />
    <StatCard
      title='Pendientes'
      value={stats.pending}
      color='text-yellow-600'
    />
    <StatCard title='Canceladas' value={stats.cancelled} color='text-red-600' />
    <StatCard
      title='Ingresos'
      value={formatPrice(stats.totalRevenue)}
      color='text-cooprudea-purple'
    />
  </div>
);

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) => (
  <Card>
    <CardHeader className='pb-2'>
      <CardTitle className='text-sm font-medium text-muted-foreground'>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </CardContent>
  </Card>
);
