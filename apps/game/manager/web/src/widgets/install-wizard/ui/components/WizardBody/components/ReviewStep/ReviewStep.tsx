import { useTranslations } from 'use-intl';

import { useInstallWizard } from '@/features/setup/install-modpack';
import { Card, Checkbox } from '@/ui-kit';

import s from './ReviewStep.module.scss';

export const ReviewStep = () => {
  const t = useTranslations('install');
  const { plan, selectedCount, removeOthers, takeSnapshot, isSnapshotForced, onSnapshotChange } = useInstallWizard();

  return (
    <Card title={t('steps.review')}>
      <ul className={s.summary}>
        {plan && <li>{t('reviewClient', { version: plan.client.version })}</li>}
        {plan && <li className={s.path}>{plan.client.modsDir}</li>}
        <li>{t('reviewComponents', { count: selectedCount })}</li>
        {removeOthers.size > 0 && <li className={s.danger}>{t('reviewRemove', { count: removeOthers.size })}</li>}
        {plan && <li>{t(`source.${plan.source}`, { version: plan.release?.version ?? '' })}</li>}
      </ul>
      <Checkbox
        checked={takeSnapshot}
        description={isSnapshotForced ? t('snapshotForced') : undefined}
        disabled={isSnapshotForced}
        label={t('snapshot')}
        onCheckedChange={onSnapshotChange}
      />
    </Card>
  );
};
