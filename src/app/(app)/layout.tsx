import { Navbar } from '@/components/shared/navbar';
import { PasswordChangeGuard } from '@/components/shared/password-change-guard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PasswordChangeGuard>
      <div>
        <Navbar />
        <main className='container mx-auto p-4 sm:p-6 lg:p-8'>{children}</main>
      </div>
    </PasswordChangeGuard>
  );
}
