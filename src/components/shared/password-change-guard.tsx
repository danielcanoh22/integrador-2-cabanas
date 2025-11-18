'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ForceChangePasswordModal } from './force-change-password-modal';

type PasswordChangeGuardProps = {
  children: React.ReactNode;
};

export const PasswordChangeGuard = ({ children }: PasswordChangeGuardProps) => {
  const router = useRouter();
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const mustChange = Cookies.get('mustChangePassword');
    const hasToken = Cookies.get('accessToken');

    if (hasToken && mustChange === 'true') {
      setMustChangePassword(true);
    }
    setIsChecking(false);
  }, []);

  const handlePasswordChanged = () => {
    Cookies.remove('mustChangePassword');
    setMustChangePassword(false);
    router.push('/cabins');
  };

  if (isChecking) {
    return null;
  }
  if (mustChangePassword) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <ForceChangePasswordModal
          open={true}
          onPasswordChanged={handlePasswordChanged}
        />
      </div>
    );
  }

  return <>{children}</>;
};
