import { useTranslations } from 'use-intl';

import { useInstallWizard } from '@/features/setup/install-modpack';
import { QueryState } from '@/ui-kit';

import { ClientStep, ComponentsStep, OtherModsStep, ReviewStep, WizardFooter, WizardStepper } from './components';

import s from './WizardBody.module.scss';

export const WizardBody = () => {
  const t = useTranslations('common');
  const { planQuery, step } = useInstallWizard();

  return (
    <div className={s.root}>
      <WizardStepper />
      <QueryState errorTitle={t('loadFailed')} loadingLabel={t('loading')} query={planQuery} retryLabel={t('retry')}>
        {() => (
          <>
            {step === 'client' && <ClientStep />}
            {step === 'components' && <ComponentsStep />}
            {step === 'otherMods' && <OtherModsStep />}
            {step === 'review' && <ReviewStep />}
            <WizardFooter />
          </>
        )}
      </QueryState>
    </div>
  );
};
