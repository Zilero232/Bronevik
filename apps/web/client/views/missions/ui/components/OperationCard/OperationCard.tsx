import { useTranslations } from 'next-intl';

import { vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { MediaCard, ProgressRing, TankImage } from '@/ui-kit';

import type { OperationCardProps } from './OperationCard.types';

import s from './OperationCard.module.scss';

export const OperationCard = ({ operation, progress }: OperationCardProps) => {
  const t = useTranslations('missions.hub');

  return (
    <MediaCard
      media={
        <span className={s.stage} data-nation={operation.reward?.nation}>
          {operation.reward && <TankImage isDecorative className={s.render} size='large' tank={vehicleIdentity(operation.reward)} withTint={false} />}
          {operation.reward && (
            <span className={s.reward}>
              <span className={s.rewardLabel}>{t('reward')}</span>
              {operation.reward.shortName}
            </span>
          )}
          {progress && (
            <ProgressRing
              className={s.ring}
              label={t('progress', { done: progress.done, total: progress.total })}
              max={Math.max(1, progress.total)}
              size={48}
              thickness={4}
              value={progress.done}
            >
              <span className={s.ringValue}>{progress.done}</span>
            </ProgressRing>
          )}
        </span>
      }
      sub={
        progress
          ? t('plateProgress', { done: progress.done, total: operation.missionsCount, honors: progress.honors })
          : `${t('missions', { count: operation.missionsCount })} · ${t('branches', { count: operation.branchesCount })}`
      }
      aspect='wide'
      href={ROUTES.missions.operation({ campaign: operation.campaignId, operation: operation.operationId })}
      title={operation.name}
    />
  );
};
