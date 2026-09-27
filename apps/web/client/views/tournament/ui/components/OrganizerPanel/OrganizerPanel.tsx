'use client';

import { useTranslations } from 'next-intl';

import { Button, Card } from '@/ui-kit';

import type { OrganizerPanelProps } from './OrganizerPanel.types';

import { useOrganizerActions } from '../../../model/hooks';

import s from './OrganizerPanel.module.scss';

export const OrganizerPanel = ({ tournament }: OrganizerPanelProps) => {
  const t = useTranslations('tournaments.organizer');
  const { isOrganizer, canOpen, canStart, hasEnoughToStart, canCancel, isBusy, onOpen, onStart, onCancel } = useOrganizerActions(tournament);

  if (!isOrganizer) {
    return null;
  }

  return (
    <Card aria-label={t('title')} className={s.root} padding='sm' variant='well'>
      <span className={s.label}>{t('title')}</span>
      <div className={s.actions}>
        {canOpen && (
          <Button disabled={isBusy} size='sm' onClick={onOpen}>
            {t('open')}
          </Button>
        )}
        {canStart && (
          <Button disabled={isBusy || !hasEnoughToStart} size='sm' title={hasEnoughToStart ? undefined : t('notEnough')} onClick={onStart}>
            {t('start')}
          </Button>
        )}
        {canCancel && (
          <Button disabled={isBusy} size='sm' variant='danger' onClick={onCancel}>
            {t('cancel')}
          </Button>
        )}
      </div>
      <p className={s.hint}>{canStart && !hasEnoughToStart ? t('notEnough') : t('hint')}</p>
    </Card>
  );
};
