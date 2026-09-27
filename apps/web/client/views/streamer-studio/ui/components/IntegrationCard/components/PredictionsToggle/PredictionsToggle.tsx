'use client';

import { useTranslations } from 'next-intl';

import { Button, Switch } from '@/ui-kit';

import type { PredictionsToggleProps } from './PredictionsToggle.types';

import { usePredictionsToggle } from '../../../../../model/hooks';

import s from './PredictionsToggle.module.scss';

export const PredictionsToggle = ({ integration }: PredictionsToggleProps) => {
  const t = useTranslations('streamer.integrations.predictions');
  const { isEnabled, canPredict, isPending, onToggle, onReconnect } = usePredictionsToggle(integration);

  return (
    <div className={s.root}>
      {canPredict ? (
        <Switch checked={isEnabled} description={t('description')} label={t('label')} onCheckedChange={onToggle} />
      ) : (
        <div className={s.reconnect}>
          <p className={s.hint}>{t('reconnectHint')}</p>
          <Button disabled={isPending} size='sm' variant='secondary' onClick={onReconnect}>
            {t('reconnect')}
          </Button>
        </div>
      )}
      <p className={s.hint}>{t('panel')}</p>
    </div>
  );
};
