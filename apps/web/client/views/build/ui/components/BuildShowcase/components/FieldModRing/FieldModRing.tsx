'use client';

import { useTranslations } from 'next-intl';

import type { FieldModRingProps } from './FieldModRing.types';

import { useShowcaseFieldMods } from '../../../../../model/hooks';
import { FieldModPair } from '../FieldModPair';

import s from './FieldModRing.module.scss';

export const FieldModRing = ({ side }: FieldModRingProps) => {
  const t = useTranslations('builds.showcase.fieldMods');
  const pairs = useShowcaseFieldMods(side);

  if (pairs.length === 0) {
    return null;
  }

  return (
    <ol aria-label={t('title')} className={s.root}>
      {pairs.map((pair) => (
        <FieldModPair key={pair.key} pair={pair} />
      ))}
    </ol>
  );
};
