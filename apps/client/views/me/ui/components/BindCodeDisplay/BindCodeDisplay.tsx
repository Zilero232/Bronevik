'use client';

import { Check, Copy, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/ui-kit';

import type { BindCodeDisplayProps } from './BindCodeDisplay.types';

import { useBindCodeDisplay } from '../../../model/hooks';

import s from './BindCodeDisplay.module.scss';

export const BindCodeDisplay = ({ code, onRenew }: BindCodeDisplayProps) => {
  const t = useTranslations('me.mod');
  const { chars, clock, isExpired, copied, onCopy } = useBindCodeDisplay(code);

  return (
    <div className={s.root} data-expired={isExpired}>
      <span className={s.label}>{t('codeLabel')}</span>
      <output aria-live='polite' className={s.code}>
        {chars.map(({ char, position }) => (
          <span key={position} className={s.char}>
            {char}
          </span>
        ))}
      </output>
      <span className={s.timer}>{isExpired ? t('expired') : t('expires', { time: clock })}</span>
      <div className={s.actions}>
        <Button disabled={isExpired} size='sm' variant='secondary' onClick={onCopy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? t('copied') : t('copy')}
        </Button>
        <Button size='sm' variant='ghost' onClick={onRenew}>
          <RefreshCw size={14} />
          {t('renew')}
        </Button>
      </div>
    </div>
  );
};
