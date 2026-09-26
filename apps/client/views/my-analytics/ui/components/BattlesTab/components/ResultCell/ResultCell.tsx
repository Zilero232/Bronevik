import { useTranslations } from 'next-intl';

import type { ResultCellProps } from './ResultCell.types';

import s from './ResultCell.module.scss';

export const ResultCell = ({ result, survived }: ResultCellProps) => {
  const t = useTranslations('analytics.battles');

  return (
    <span className={s.root} data-result={result}>
      {t(`results.${result}`)}
      <span className={s.fate}>{t(survived ? 'survived' : 'destroyed')}</span>
    </span>
  );
};
