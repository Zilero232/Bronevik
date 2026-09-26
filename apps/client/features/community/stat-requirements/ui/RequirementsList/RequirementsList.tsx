'use client';

import { clsx } from 'clsx';
import { useFormatter, useTranslations } from 'next-intl';

import type { RequirementsListProps } from './RequirementsList.types';

import { requirementEntries } from '../../lib/requirements';

import s from './RequirementsList.module.scss';

export const RequirementsList = ({ requirements, className }: RequirementsListProps) => {
  const t = useTranslations('community.requirements');
  const format = useFormatter();
  const entries = requirementEntries(requirements);

  if (entries.length === 0) {
    return <p className={clsx(s.none, className)}>{t('none')}</p>;
  }

  return (
    <ul aria-label={t('title')} className={clsx(s.root, className)}>
      {entries.map(({ key, value }) => (
        <li key={key} className={s.item}>
          {t(key, { value: format.number(value, { maximumFractionDigits: 1 }) })}
        </li>
      ))}
    </ul>
  );
};
