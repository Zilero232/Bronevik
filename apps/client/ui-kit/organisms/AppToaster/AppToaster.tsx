'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

export const AppToaster = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster className='bronevik-toaster' closeButton={false} gap={10} position='bottom-right' theme={resolvedTheme === 'light' ? 'light' : 'dark'} />
  );
};
