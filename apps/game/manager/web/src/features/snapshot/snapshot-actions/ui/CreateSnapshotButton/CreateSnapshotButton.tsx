import { Camera } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/ui-kit';

import type { CreateSnapshotButtonProps } from './CreateSnapshotButton.types';

import { useCreateSnapshot } from '../../model/hooks';

export const CreateSnapshotButton = ({ clientPath }: CreateSnapshotButtonProps) => {
  const t = useTranslations('backups');
  const { isPending, onCreate } = useCreateSnapshot(clientPath);

  return (
    <Button disabled={clientPath === null} isPending={isPending} onClick={onCreate}>
      {!isPending && <Camera aria-hidden />}
      {t('create')}
    </Button>
  );
};
