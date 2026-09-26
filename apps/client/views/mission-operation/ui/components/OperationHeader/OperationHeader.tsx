import { useTranslations } from 'next-intl';

import { vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { KeyFigure, KeyFigures, PageHeader, TankImage } from '@/ui-kit';

import type { OperationHeaderProps } from './OperationHeader.types';

import s from './OperationHeader.module.scss';

export const OperationHeader = ({ data, totals }: OperationHeaderProps) => {
  const t = useTranslations('missions');

  const { campaign, operation } = data;
  const campaignName = campaign.name ?? t('hub.campaign', { id: campaign.campaignId });

  return (
    <PageHeader
      aside={operation.reward && <TankImage isDecorative className={s.render} size='big' tank={vehicleIdentity(operation.reward)} />}
      breadcrumbs={[{ label: t('hub.title'), href: ROUTES.missions.hub }, { label: campaignName }, { label: operation.name }]}
      description={operation.description}
      title={operation.name}
    >
      <KeyFigures>
        <KeyFigure label={t('operation.missions')} value={operation.missionsCount} />
        <KeyFigure label={t('operation.branches')} value={operation.branchesCount} />
        {totals && <KeyFigure label={t('operation.done')} value={totals.done} />}
        {totals && <KeyFigure label={t('operation.honors')} value={totals.honors} />}
      </KeyFigures>
    </PageHeader>
  );
};
