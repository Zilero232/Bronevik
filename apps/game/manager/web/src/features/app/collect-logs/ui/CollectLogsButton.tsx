import { FileArchive } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/ui-kit';

import { useCollectLogs } from '../model/hooks';

export const CollectLogsButton = () => {
  const t = useTranslations('about');
  const { isPending, onCollect } = useCollectLogs();

  return (
    <Button isPending={isPending} variant='secondary' onClick={onCollect}>
      {!isPending && <FileArchive aria-hidden />}
      {t('logsCollect')}
    </Button>
  );
};
