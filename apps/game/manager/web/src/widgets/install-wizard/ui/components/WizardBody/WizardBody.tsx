import { useInstallWizard } from '@/features/setup/install-modpack';
import { useQueryLabels } from '@/shared/lib';
import { QueryState } from '@/ui-kit';

import { ClientStep, ComponentsStep, OtherModsStep, ReviewStep, WizardFooter, WizardStepper } from './components';

import s from './WizardBody.module.scss';

export const WizardBody = () => {
  const queryLabels = useQueryLabels();
  const { planQuery, step } = useInstallWizard();

  return (
    <div className={s.root}>
      <WizardStepper />
      <QueryState {...queryLabels} query={planQuery}>
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
