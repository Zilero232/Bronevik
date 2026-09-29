'use client';

import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, Skeleton } from '@/ui-kit';

import { useTelegramWidget } from '../../../model/hooks';

import s from './TelegramLogin.module.scss';

export const TelegramLogin = () => {
  const t = useTranslations('auth');
  const { containerRef, isEnabled, isLoaded, isSigningIn } = useTelegramWidget();

  return (
    <div aria-busy={isSigningIn} className={s.root}>
      {!isLoaded && <Skeleton height={40} shape='block' width='100%' />}
      <div ref={containerRef} className={s.widget} data-enabled={isEnabled} />
      {isLoaded && !isEnabled && (
        <>
          <Button block disabled variant='secondary'>
            <Send aria-hidden size={14} />
            {t('telegram')}
          </Button>
          <p className={s.hint}>{t('telegramDisabled')}</p>
        </>
      )}
    </div>
  );
};
