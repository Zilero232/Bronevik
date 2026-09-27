'use client';

import { useTranslations } from 'next-intl';

import { ErrorState } from '@/ui-kit';

import { CONNECTABLE_PROVIDERS, UPCOMING_PROVIDERS } from '../../../config';
import { useIntegrations } from '../../../model/hooks';
import { IntegrationCard } from '../IntegrationCard';

import s from './IntegrationsPanel.module.scss';

export const IntegrationsPanel = () => {
  const t = useTranslations('streamer.integrations');
  const { data: integrations = [], isPending, isError, isFetching, refetch } = useIntegrations();

  return (
    <section className={s.root}>
      <p className={s.note}>{t('description')}</p>
      {isError && <ErrorState isRetrying={isFetching} onRetry={() => void refetch()} />}
      <div className={s.grid}>
        {!isError &&
          CONNECTABLE_PROVIDERS.map(({ provider, path }) => (
            <IntegrationCard
              key={provider}
              integration={integrations.find((item) => item.provider === provider) ?? null}
              isLoading={isPending}
              path={path}
              provider={provider}
            />
          ))}
        {UPCOMING_PROVIDERS.map((provider) => (
          <IntegrationCard key={provider} integration={null} isLoading={false} path={null} provider={provider} />
        ))}
      </div>
    </section>
  );
};
