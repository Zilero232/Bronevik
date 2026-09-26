'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/ui-kit';

import { useTelegramWidget } from '../../../model/hooks';

import s from './TelegramLogin.module.scss';

export const TelegramLogin = () => {
  const t = useTranslations('auth');
  const { containerRef, isEnabled, isLoaded } = useTelegramWidget();

  return (
    <div className={s.root}>
      <div ref={containerRef} className={s.widget} data-enabled={isEnabled} />
      {isLoaded && !isEnabled && (
        <>
          <Button block disabled variant='secondary'>
            {t('telegram')}
          </Button>
          <p className={s.hint}>{t('telegramDisabled')}</p>
        </>
      )}
    </div>
  );
};
