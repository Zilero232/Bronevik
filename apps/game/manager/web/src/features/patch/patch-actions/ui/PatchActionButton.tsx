import { useTranslations } from 'use-intl';

import { Button } from '@/ui-kit';

import type { PatchActionButtonProps } from './PatchActionButton.types';

import { PATCH_ACTION_BUTTONS } from '../config';
import { usePatchAction } from '../model/hooks';

export const PatchActionButton = ({ kind, clientPath }: PatchActionButtonProps) => {
  const t = useTranslations('patch');
  const { isPending, run } = usePatchAction({ kind, clientPath });
  const { variant, label, icon: Icon } = PATCH_ACTION_BUTTONS[kind];

  return (
    <Button isPending={isPending} variant={variant} onClick={run}>
      {!isPending && <Icon aria-hidden />}
      {t(label)}
    </Button>
  );
};
