import { useTranslations } from 'next-intl';

import { vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { ProgressBar, TankImage } from '@/ui-kit';

import type { OperationCardProps } from './OperationCard.types';

import s from './OperationCard.module.scss';

export const OperationCard = ({ operation, progress }: OperationCardProps) => {
  const t = useTranslations('missions.hub');

  return (
    <Link className={s.root} href={ROUTES.missionOperation({ campaign: operation.campaignId, operation: operation.operationId })}>
      {operation.reward && <TankImage isDecorative className={s.render} size='big' tank={vehicleIdentity(operation.reward)} />}
      <div className={s.body}>
        {operation.reward && <span className={s.label}>{t('reward')}</span>}
        <h3 className={s.name}>{operation.name}</h3>
        <p className={s.meta}>
          {t('missions', { count: operation.missionsCount })} · {t('branches', { count: operation.branchesCount })}
        </p>
        {progress && (
          <ProgressBar
            label={t('progress', { done: progress.done, total: progress.total })}
            max={Math.max(1, progress.total)}
            size='sm'
            value={progress.done}
            valueLabel={t('honors', { count: progress.honors })}
          />
        )}
      </div>
    </Link>
  );
};
