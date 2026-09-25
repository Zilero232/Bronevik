'use client';

import { Ban } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ChallengeActionsProps } from './ChallengeActions.types';

import { useCancelChallenge } from '../../../model/hooks';
import { ActivateDialog } from '../ActivateDialog';
import { ConfirmAction } from '../ConfirmAction';

import s from './ChallengeActions.module.scss';

export const ChallengeActions = ({ id, status }: ChallengeActionsProps) => {
  const t = useTranslations('streamer.challenges.actions');
  const cancel = useCancelChallenge();

  if (status !== 'pending' && status !== 'active') {
    return null;
  }

  return (
    <div className={s.root}>
      {status === 'pending' && <ActivateDialog id={id} />}
      <ConfirmAction
        confirmLabel={t('cancel')}
        description={t('cancelDescription')}
        icon={<Ban size={14} />}
        isPending={cancel.isPending}
        title={t('cancelTitle')}
        triggerLabel={t('cancel')}
        onConfirm={() => cancel.mutate(id)}
      />
    </div>
  );
};
