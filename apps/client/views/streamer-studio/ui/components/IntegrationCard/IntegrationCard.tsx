'use client';

import { Plug, Unplug } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { Badge, Button, Skeleton } from '@/ui-kit';

import type { IntegrationCardProps } from './IntegrationCard.types';

import { INTEGRATION_BADGE } from '../../../config';
import { useConnectIntegration, useDisconnectIntegration } from '../../../model/hooks';
import { ConfirmAction } from '../ConfirmAction';

import s from './IntegrationCard.module.scss';

export const IntegrationCard = ({ provider, path, integration, isLoading }: IntegrationCardProps) => {
  const t = useTranslations('streamer.integrations');
  const format = useFormatter();
  const connect = useConnectIntegration();
  const disconnect = useDisconnectIntegration();

  const name = t(`provider.${provider}`);
  const state = match({ integration, path })
    .with({ integration: P.nonNullable }, () => 'on' as const)
    .with({ path: P.nonNullable }, () => 'off' as const)
    .otherwise(() => 'soon' as const);

  const { tone, label } = INTEGRATION_BADGE[state];

  return (
    <article className={s.root} data-state={state}>
      <header className={s.head}>
        <h3 className={s.name}>{name}</h3>
        <Badge tone={tone}>{t(label)}</Badge>
      </header>
      <p className={s.about}>{t(`about.${provider}`)}</p>
      {isLoading && <Skeleton height={36} shape='block' />}
      {!isLoading &&
        match({ integration, path })
          .with({ integration: P.nonNullable, path: P.nonNullable }, ({ integration: linked, path: provided }) => (
            <footer className={s.foot}>
              <span className={s.login}>
                {t('connectedAs', {
                  login: linked.login ?? linked.externalId,
                  date: format.dateTime(new Date(linked.connectedAt), { dateStyle: 'medium' })
                })}
              </span>
              <ConfirmAction
                confirmLabel={t('disconnect')}
                description={t('disconnectDescription', { name })}
                icon={<Unplug size={14} />}
                isPending={disconnect.isPending}
                title={t('disconnectTitle', { name })}
                triggerLabel={t('disconnect')}
                onConfirm={() => disconnect.mutate(provided)}
              />
            </footer>
          ))
          .with({ path: P.nonNullable }, ({ path: provided }) => (
            <Button disabled={connect.isPending} size='sm' onClick={() => connect.mutate(provided)}>
              <Plug size={14} />
              {t('connect')}
            </Button>
          ))
          .otherwise(() => null)}
    </article>
  );
};
