'use client';

import { Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import type { LabelColumnProps } from './LabelColumn.types';

import s from './LabelColumn.module.scss';

export const LabelColumn = ({ count, sections }: LabelColumnProps) => {
  const t = useTranslations('tanks.compare.board');

  return (
    <div className={s.root}>
      <div className={s.head}>
        <span className={s.eyebrow}>{t('specs')}</span>
        <span className={s.count}>{t('count', { count })}</span>
        <span className={s.legend}>
          <Crown aria-hidden size={12} />
          {t('legend')}
        </span>
      </div>
      {sections.map((section, index) => (
        <Fragment key={section.id}>
          <div className={s.section}>
            <span className={s.index}>{String(index + 1).padStart(2, '0')}</span>
            <span className={s.sectionTitle}>{section.title}</span>
          </div>
          {section.rows.map((row) => (
            <div key={row.key} className={s.label}>
              <span className={s.labelText}>{row.label}</span>
              {row.unit && <span className={s.unit}>{row.unit}</span>}
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
};
