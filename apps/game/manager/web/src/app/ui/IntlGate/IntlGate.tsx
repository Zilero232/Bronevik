import { Toaster } from 'sonner';
import { IntlProvider } from 'use-intl';

import { LOCALE } from '@/shared/config';

import type { IntlGateProps } from './IntlGate.types';

import { APP } from '../../config';
import { useAppLocale } from '../../model/hooks';

export const IntlGate = ({ children }: IntlGateProps) => {
  const { locale, messages } = useAppLocale();

  return (
    <IntlProvider locale={locale} messages={messages} timeZone={LOCALE.timeZone}>
      {children}
      <Toaster closeButton duration={APP.toastDurationMs} position='bottom-right' theme='dark' />
    </IntlProvider>
  );
};
