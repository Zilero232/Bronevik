import { useTranslations } from 'next-intl';

import { vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { KeyFigure, KeyFigures, PageHeader, ProgressRing, TankImage } from '@/ui-kit';

import type { OperationHeaderProps } from './OperationHeader.types';

import { MISSION_BOARD } from '../../../config';

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
        {totals && (
          <ProgressRing
            label={t('operation.progress', { done: totals.done, total: operation.missionsCount })}
            max={Math.max(operation.missionsCount, 1)}
            size={MISSION_BOARD.headerRingSize}
            value={totals.done}
          >
            <span className={s.ringValue}>{t('operation.ratio', { done: totals.done, total: operation.missionsCount })}</span>
          </ProgressRing>
        )}
        <KeyFigure label={t('operation.missions')} value={operation.missionsCount} />
        <KeyFigure label={t('operation.branches')} value={operation.branchesCount} />
        {totals && <KeyFigure label={t('operation.done')} value={totals.done} />}
        {totals && <KeyFigure label={t('operation.honors')} value={totals.honors} />}
      </KeyFigures>
    </PageHeader>
  );
};
