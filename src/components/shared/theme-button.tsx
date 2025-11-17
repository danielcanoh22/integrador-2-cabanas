import React from 'react';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export const ThemeButton = () => {
  const { setTheme } = useTheme();

  const handleChangeTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Button
      onClick={handleChangeTheme}
      variant='ghost'
      size='icon'
      className='relative w-9 h-9 cursor-pointer'
    >
      <Sun className='h-[1.2rem] w-[1.2rem] scale-0 rotate-0 transition-all dark:scale-100 dark:-rotate-90' />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-100 rotate-90 transition-all dark:scale-0 dark:rotate-0' />
    </Button>
  );
};
