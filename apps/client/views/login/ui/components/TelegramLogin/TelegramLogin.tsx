'use client';

import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import { Button } from '@/ui-kit';

import { useCompleteSignIn, useTelegramWidget } from '../../../model/hooks';

import s from './TelegramLogin.module.scss';

export const TelegramLogin = () => {
  const t = useTranslations('auth');
  const completeSignIn = useCompleteSignIn();

  const containerRef = useRef<HTMLDivElement>(null);

  const { isEnabled, isLoaded } = useTelegramWidget({ container: containerRef, onSignedIn: completeSignIn });

  return (
    <div className={s.root}>
      <div ref={containerRef} className={s.widget} data-enabled={isEnabled} />
      {isLoaded && !isEnabled && (
        <>
          <Button block disabled variant='secondary'>
            <Send size={16} />
            {t('telegram')}
          </Button>
          <p className={s.hint}>{t('telegramDisabled')}</p>
        </>
      )}
    </div>
  );
};
