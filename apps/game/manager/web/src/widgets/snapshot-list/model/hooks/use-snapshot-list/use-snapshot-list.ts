import { useFormatter, useTranslations } from 'use-intl';

import { useSelectedClient } from '@/entities/client';
import { useSnapshots } from '@/entities/snapshot';
import { parseLocalDateTime } from '@/shared/lib';

import { SNAPSHOT_LIST } from '../../../config';

export const useSnapshotList = () => {
  const t = useTranslations('backups');
  const format = useFormatter();
  const { clientPath } = useSelectedClient();
  const snapshotsQuery = useSnapshots(clientPath);

  return {
    clientPath,
    snapshotsQuery,
    rows: (snapshotsQuery.data ?? []).map((snapshot) => {
      const date = parseLocalDateTime(snapshot.date);

      return {
        id: snapshot.id,
        date: date ? format.dateTime(date, { dateStyle: 'medium', timeStyle: 'short' }) : snapshot.id,
        kind: t(`kind.${snapshot.kind}`),
        size: format.number(snapshot.sizeBytes / SNAPSHOT_LIST.bytesPerMegabyte, { style: 'unit', unit: 'megabyte', maximumFractionDigits: 1 }),
        parts: snapshot.parts.map((part) => (part.existed ? t(`part.${part.name}`) : t('partMissing', { part: t(`part.${part.name}`) })))
      };
    })
  };
};
