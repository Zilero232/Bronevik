'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Badge, Button, Skeleton } from '@/ui-kit';

import type { IntegrationCardProps } from './IntegrationCard.types';

import { useIntegrationCard } from '../../../model/hooks';
import { ConfirmAction } from '../ConfirmAction';

import s from './IntegrationCard.module.scss';

export const IntegrationCard = ({ provider, path, integration, isLoading }: IntegrationCardProps) => {
  const t = useTranslations('streamer.integrations');
  const { state, badge, connectedAs, isConnecting, isDisconnecting, onConnect, onDisconnect } = useIntegrationCard({ integration, path });

  const name = t(`provider.${provider}`);

  return (
    <article className={s.root} data-state={state}>
      <header className={s.head}>
        <h3 className={s.name}>{name}</h3>
        <Badge tone={badge.tone}>{t(badge.label)}</Badge>
      </header>
      <p className={s.about}>{t(`about.${provider}`)}</p>
      {match({ isLoading, state })
        .with({ isLoading: true }, () => <Skeleton height={32} shape='block' />)
        .with({ state: 'on' }, () => (
          <footer className={s.foot}>
            {connectedAs && <span className={s.login}>{t('connectedAs', connectedAs)}</span>}
            <ConfirmAction
              confirmLabel={t('disconnect')}
              description={t('disconnectDescription', { name })}
              isPending={isDisconnecting}
              title={t('disconnectTitle', { name })}
              triggerLabel={t('disconnect')}
              onConfirm={onDisconnect}
            />
          </footer>
        ))
        .with({ state: 'off' }, () => (
          <Button disabled={isConnecting} size='sm' onClick={onConnect}>
            {t('connect')}
          </Button>
        ))
        .otherwise(() => null)}
    </article>
  );
};
