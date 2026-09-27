import { useTranslations } from 'use-intl';

import { ClientPicker } from '@/features/client/client-picker';
import { useInstallWizard } from '@/features/setup/install-modpack';
import { Badge, Card } from '@/ui-kit';

import s from './ClientStep.module.scss';

export const ClientStep = () => {
  const t = useTranslations();
  const { plan } = useInstallWizard();

  return (
    <Card description={t('install.description')} title={t('install.steps.client')}>
      <ClientPicker />
      {plan && (
        <div className={s.facts}>
          <span>{t('client.version', { version: plan.client.version })}</span>
          <span className={s.path}>{plan.client.modsDir}</span>
          {plan.client.problem && <Badge tone='danger'>{t(`client.problem.${plan.client.problem}`)}</Badge>}
          <Badge tone={plan.source === 'unavailable' ? 'danger' : 'neutral'}>
            {t(`install.source.${plan.source}`, { version: plan.release?.version ?? '' })}
          </Badge>
        </div>
      )}
    </Card>
  );
};
