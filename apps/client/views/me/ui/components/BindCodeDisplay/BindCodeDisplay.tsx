'use client';

import { useCopy, useInterval } from '@siberiacancode/reactuse';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { SCALE_IN } from '@/shared/lib';
import { Button } from '@/ui-kit';

import type { BindCodeDisplayProps } from './BindCodeDisplay.types';

import s from './BindCodeDisplay.module.scss';

const TICK_MS = 1_000;
const SECONDS_IN_MINUTE = 60;

export const BindCodeDisplay = ({ code, onRenew }: BindCodeDisplayProps) => {
  const t = useTranslations('me.mod');
  const { copied, copy } = useCopy();

  const [now, setNow] = useState(() => Date.now());

  useInterval(() => setNow(Date.now()), TICK_MS);

  const left = Math.max(0, Math.round((new Date(code.expiresAt).getTime() - now) / TICK_MS));
  const isExpired = left === 0;
  const clock = `${Math.floor(left / SECONDS_IN_MINUTE)}:${String(left % SECONDS_IN_MINUTE).padStart(2, '0')}`;

  return (
    <motion.div animate='visible' className={s.root} data-expired={isExpired} initial='hidden' variants={SCALE_IN}>
      <span className={s.label}>{t('codeLabel')}</span>
      <output aria-live='polite' className={s.code}>
        {[...code.code]
          .map((char, position) => ({ char, position }))
          .map(({ char, position }) => (
            <span key={position} className={s.char}>
              {char}
            </span>
          ))}
      </output>
      <span className={s.timer}>{isExpired ? t('expired') : t('expires', { time: clock })}</span>
      <div className={s.actions}>
        <Button disabled={isExpired} size='sm' variant='secondary' onClick={() => copy(code.code)}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? t('copied') : t('copy')}
        </Button>
        <Button size='sm' variant='ghost' onClick={onRenew}>
          <RefreshCw size={14} />
          {t('renew')}
        </Button>
      </div>
    </motion.div>
  );
};
