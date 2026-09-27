import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { RelativeTime } from '@/ui-kit';

import type { ModeSourceNoteProps } from './ModeSourceNote.types';

import s from './ModeSourceNote.module.scss';

export const ModeSourceNote = ({ windowDays, computedAt, className }: ModeSourceNoteProps) => {
  const t = useTranslations('modes.source');

  return (
    <p className={clsx(s.root, className)}>
      {t('text', { days: windowDays })}
      {computedAt && (
        <>
          {' · '}
          {t('updated')} <RelativeTime value={computedAt} />
        </>
      )}
    </p>
  );
};
