import { useTranslations } from 'use-intl';

import { useSelectedClient } from '@/entities/client';
import { useSnapshots } from '@/entities/snapshot';
import { parseLocalDateTime, useDisplayFormat } from '@/shared/lib';

export const useSnapshotList = () => {
  const t = useTranslations('backups');
  const { stamp, megabytes } = useDisplayFormat();
  const { clientPath } = useSelectedClient();
  const snapshotsQuery = useSnapshots(clientPath);

  return {
    clientPath,
    snapshotsQuery,
    rows: (snapshotsQuery.data ?? []).map((snapshot) => {
      const date = parseLocalDateTime(snapshot.date);

      return {
        id: snapshot.id,
        date: date ? stamp(date) : snapshot.id,
        kind: t(`kind.${snapshot.kind}`),
        size: megabytes(snapshot.sizeBytes),
        parts: snapshot.parts.map((part) => (part.existed ? t(`part.${part.name}`) : t('partMissing', { part: t(`part.${part.name}`) })))
      };
    })
  };
};
