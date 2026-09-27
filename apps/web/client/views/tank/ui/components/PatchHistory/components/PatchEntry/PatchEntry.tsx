'use client';

import { parseISO } from 'date-fns';
import { useFormatter, useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { PatchEntryProps } from './PatchEntry.types';

import { VERDICT_TONES } from '../../../../../config';
import { PatchChange } from '../PatchChange';

import s from './PatchEntry.module.scss';

export const PatchEntry = ({ entry }: PatchEntryProps) => {
  const t = useTranslations('tank.patches');
  const format = useFormatter();

  const { version, title, date, verdict, changes } = entry;

  return (
    <div className={s.root} data-verdict={verdict}>
      <header className={s.head}>
        <Badge tone={VERDICT_TONES[verdict]}>{version}</Badge>
        <span className={s.verdict}>{t(`verdicts.${verdict}`)}</span>
        {title && <span className={s.title}>{title}</span>}
        {date && (
          <time className={s.date} dateTime={date}>
            {format.dateTime(parseISO(date), { dateStyle: 'medium' })}
          </time>
        )}
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
  );
};
