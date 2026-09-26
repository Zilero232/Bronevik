import { useTranslations } from 'next-intl';

import { ModeRankBadge } from '@/entities/mode/mode';
import { TankLink, WinRateCell } from '@/entities/tank/tank';
import { Card } from '@/ui-kit';

import type { RankGroupsProps } from './RankGroups.types';

import s from './RankGroups.module.scss';

export const RankGroups = ({ groups }: RankGroupsProps) => {
  const t = useTranslations('modes.table');

  return (
    <Card className={s.root} padding='none'>
      {groups.map((group) => (
        <div key={group.rank ?? 'none'} className={s.band}>
          <div className={s.rank}>{group.rank ? <ModeRankBadge rank={group.rank} size='md' /> : t('unranked')}</div>
          <ul className={s.tanks}>
            {group.tanks.map((tank) => (
              <li key={tank.vehicle.tankId} className={s.tank}>
                <TankLink className={s.link} image='small' vehicle={tank.vehicle} />
                <WinRateCell className={s.value} value={tank.winRate} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Card>
  );
};
