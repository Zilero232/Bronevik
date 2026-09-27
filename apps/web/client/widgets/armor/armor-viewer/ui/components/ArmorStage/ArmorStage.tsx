'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import type { ArmorCanvasProps } from '../ArmorCanvas';

import { ArmorScanner } from '../ArmorScanner';

import s from './ArmorStage.module.scss';

const ArmorCanvas = dynamic(() => import('../ArmorCanvas').then(({ ArmorCanvas: Component }) => Component), {
  ssr: false,
  loading: () => <ArmorScanner />
});

export const ArmorStage = (props: ArmorCanvasProps) => {
  const t = useTranslations('armor.controls');

  return (
    <div className={s.root}>
      <span aria-hidden className={s.brackets} />
      <ArmorCanvas {...props} />
      <p className={s.hint}>{t('hint')}</p>
    </div>
  );
};
