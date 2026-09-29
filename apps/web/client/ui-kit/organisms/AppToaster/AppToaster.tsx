'use client';

import { Toaster } from 'sonner';

import { useToasterLayout } from '@/shared/lib';

import { APP_TOASTER } from './AppToaster.constants';

export const AppToaster = () => {
  const layout = useToasterLayout();

  return <Toaster {...layout} className={APP_TOASTER.className} gap={APP_TOASTER.gap} mobileOffset={APP_TOASTER.mobileOffset} />;
};
