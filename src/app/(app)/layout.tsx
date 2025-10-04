import { Navbar } from '@/components/shared/navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className='container mx-auto p-4 sm:p-6 lg:p-8'>{children}</main>
    </div>
  );
}
