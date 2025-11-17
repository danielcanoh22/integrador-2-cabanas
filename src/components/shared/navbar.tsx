'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  Building2,
  Calendar,
  Home,
  LogOut,
  Menu,
  Settings,
  UserRoundCheck,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { isAdmin } from '@/lib/auth';
import { useUserProfile } from '@/hooks/useUsers';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ThemeButton } from './theme-button';
import { ChangePasswordModal } from './change-password-modal';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Usar TanStack Query para obtener perfil de usuario
  const { data: user } = useUserProfile();

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      setIsUserAdmin(isAdmin(token));
    }
  }, []);

  const navigation = [
    { name: 'Cabañas', href: '/cabins', icon: Home },
    { name: 'Mis Reservas', href: '/reservations', icon: Calendar },
    ...(isUserAdmin
      ? [
          {
            name: 'Gestionar Cabañas',
            href: '/admin/cabins-management',
            icon: Building2,
          },
          {
            name: 'Gestionar Reservas',
            href: '/admin/reservation-management',
            icon: Settings,
          },
          {
            name: 'Gestionar Usuarios',
            href: '/admin/documents-management',
            icon: UserRoundCheck,
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    router.push('/login');
  };

  return (
    <header className='sticky top-0 z-50 bg-white dark:bg-[#171717] border-b border-border'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between gap-4 h-16'>
          <Link href='/cabins'>
            <Image
              src='/assets/image/logo.png'
              width={132}
              height={44}
              alt='Logo de Cooprudea'
            />
          </Link>

          <nav className='hidden md:flex items-center space-x-2'>
            {navigation.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-green text-white'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className='h-4 w-4' />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className='hidden md:flex items-center space-x-4'>
            {user && (
              <span className='text-sm text-muted-foreground'>
                Bienvenido, {user.fullName}
              </span>
            )}
            <ThemeButton />
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setShowChangePassword(true)}
              className='cursor-pointer hover:bg-primary-purple hover:text-white'
            >
              <Settings className='h-5 w-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleLogout}
              className='cursor-pointer hover:bg-primary-purple hover:text-white'
            >
              <LogOut className='h-5 w-5' />
            </Button>
          </div>

          <div className='md:hidden'>
            <Sheet>
              <div className='inline-block mr-4'>
                <ThemeButton />
              </div>
              <SheetTrigger asChild>
                <Button variant='outline' size='icon'>
                  <Menu className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side='right'>
                <SheetHeader>
                  <SheetTitle className='sr-only'>Menú Principal</SheetTitle>
                  <SheetDescription className='sr-only'>
                    Lista de enlaces para navegar por las diferentes secciones
                    de la aplicación.
                  </SheetDescription>
                </SheetHeader>

                <div className='flex flex-col h-full p-4'>
                  <div className='flex flex-col space-y-4'>
                    {navigation.map((item) => {
                      const isActive =
                        item.href === '/'
                          ? pathname === item.href
                          : pathname.startsWith(item.href);

                      return (
                        <SheetClose asChild key={item.name}>
                          <Link
                            href={item.href}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors text-lg ${
                              isActive
                                ? 'bg-primary-green text-white'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                          >
                            <item.icon className='h-5 w-5' />
                            <span>{item.name}</span>
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>

                  <div className='mt-auto'>
                    <hr className='my-4' />
                    <div className='flex items-center space-x-3 p-3 justify-between'>
                      {user && (
                        <span className='text-sm text-muted-foreground'>
                          Bienvenido, {user.fullName}
                        </span>
                      )}
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleLogout}
                        className='cursor-pointer hover:bg-primary-purple hover:text-white'
                      >
                        <LogOut className='h-5 w-5' />
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
      />
    </header>
  );
};
