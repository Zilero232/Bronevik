import { useTranslations } from 'use-intl';

import { INSTALL_WIZARD, useInstallWizard } from '@/features/setup/install-modpack';

import s from './WizardStepper.module.scss';

export const WizardStepper = () => {
  const t = useTranslations('install');
  const { stepIndex, goTo } = useInstallWizard();

  return (
    <nav aria-label={t('stepsLabel')}>
      <ol className={s.root}>
        {INSTALL_WIZARD.steps.map((step, index) => (
          <li key={step}>
            <button
              aria-current={index === stepIndex ? 'step' : undefined}
              className={s.step}
              data-done={index < stepIndex || undefined}
              disabled={index > stepIndex}
              type='button'
              onClick={() => goTo(index)}
            >
              <span className={s.number}>{index + 1}</span>
              {t(`steps.${step}`)}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};
