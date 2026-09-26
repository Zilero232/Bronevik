import { useTranslations } from 'next-intl';

import type { FieldModRingProps } from './FieldModRing.types';

import { FieldModPair } from '../FieldModPair';

import s from './FieldModRing.module.scss';

export const FieldModRing = ({ pairs, isShares }: FieldModRingProps) => {
  const t = useTranslations('builds.showcase.fieldMods');

  if (pairs.length === 0) {
    return null;
  }

  return (
    <ol aria-label={t('title')} className={s.root}>
      {pairs.map((pair) => (
        <FieldModPair key={pair.key} isShares={isShares} pair={pair} />
      ))}
    </ol>
  );
};
