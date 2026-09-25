'use client';

import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CopyField } from '@/ui-kit';

import type { SecretRevealProps } from './SecretReveal.types';

import s from './SecretReveal.module.scss';

export const SecretReveal = ({ secret, kind }: SecretRevealProps) => {
  const t = useTranslations('developer.secret');

  return (
    <div className={s.root}>
      <div className={s.warning} role='alert'>
        <TriangleAlert aria-hidden className={s.icon} size={20} />
        <div className={s.copy}>
          <strong className={s.title}>{t('warningTitle')}</strong>
          <p className={s.text}>{t(`warning.${kind}`)}</p>
        </div>
      </div>
      <CopyField isSecret label={t(`label.${kind}`)} tone='accent' value={secret} />
    </div>
  );
};
