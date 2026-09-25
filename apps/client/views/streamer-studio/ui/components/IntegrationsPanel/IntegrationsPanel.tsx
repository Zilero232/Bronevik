'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { CONNECTABLE_PROVIDERS, UPCOMING_PROVIDERS } from '../../../config';
import { useIntegrations } from '../../../model/hooks';
import { IntegrationCard } from '../IntegrationCard';

import s from './IntegrationsPanel.module.scss';

export const IntegrationsPanel = () => {
  const t = useTranslations('streamer.integrations');
  const { data: integrations = [], isPending } = useIntegrations();

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} title={t('title')} />
      <div className={s.grid}>
        {CONNECTABLE_PROVIDERS.map(({ provider, path }) => (
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
