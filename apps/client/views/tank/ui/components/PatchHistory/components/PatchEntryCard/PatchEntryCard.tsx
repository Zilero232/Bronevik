'use client';

import { parseISO } from 'date-fns';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { REVEAL_VIEWPORT, ROW_ITEM } from '@/shared/lib';
import { Badge } from '@/ui-kit';

import type { PatchEntryCardProps } from './PatchEntryCard.types';

import { PatchChange } from '../PatchChange';
import { VERDICT_TONES } from './PatchEntryCard.constants';

import s from './PatchEntryCard.module.scss';

export const PatchEntryCard = ({ entry, index }: PatchEntryCardProps) => {
  const t = useTranslations('tank.patches');
  const format = useFormatter();

  const { version, title, date, verdict, changes } = entry;

  return (
    <motion.li
      className={s.root}
      custom={index}
      data-verdict={verdict}
      initial='hidden'
      variants={ROW_ITEM}
      viewport={REVEAL_VIEWPORT}
      whileInView='visible'
    >
      <span aria-hidden className={s.node} />
      <div className={s.card}>
        <header className={s.head}>
          <h3 className={s.version}>{title ? `${t('version', { version })} · ${title}` : t('version', { version })}</h3>
          {date && (
            <time className={s.date} dateTime={date}>
              {format.dateTime(parseISO(date), { dateStyle: 'medium' })}
            </time>
          )}
          <Badge tone={VERDICT_TONES[verdict]}>{t(`verdicts.${verdict}`)}</Badge>
          <span className={s.count}>{t('changes', { count: changes.length })}</span>
        </header>
        {changes.length > 0 ? (
          <ul className={s.changes}>
            {changes.map((change) => (
              <PatchChange key={change.key} change={change} />
            ))}
          </ul>
        ) : (
          <p className={s.note}>{t(verdict === 'new' ? 'firstSeen' : 'noSpecChanges')}</p>
        )}
      </div>
    </motion.li>
  );
};
