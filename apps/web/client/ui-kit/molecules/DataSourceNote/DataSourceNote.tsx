import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { DataSourceNoteProps } from './DataSourceNote.types';

import { RelativeTime } from '../../atoms';

import s from './DataSourceNote.module.scss';

export const DataSourceNote = ({ updatedAt, className }: DataSourceNoteProps) => {
  const t = useTranslations('common');

  return (
    <p className={clsx(s.root, className)}>
      {t('dataSource')}
      {updatedAt && (
        <>
          {' · '}
          {t('updated')} <RelativeTime value={updatedAt} />
        </>
      )}
    </p>
  );
};
