'use client';

import { TANK_CLASS_SILHOUETTES } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { TankIdentity, TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { Card } from '@/ui-kit';

import { silhouetteBlur } from '../../../lib/silhouette-blur';
import { useGuessGame } from '../../../model/context';

import s from './MysteryTank.module.scss';

export const MysteryTank = () => {
  const t = useTranslations('play.mystery');
  const { target, clueCount, status } = useGuessGame();

  const Silhouette = TANK_CLASS_SILHOUETTES[target.type];
  const identity = vehicleIdentity(target);
  const isOver = status !== 'playing';

  return (
    <Card className={s.root} data-status={status} variant='panel'>
      <div className={s.stage}>
        {isOver ? (
          <TankImage size='big' tank={identity} />
        ) : (
          <span aria-hidden className={s.silhouette} style={{ filter: `blur(${silhouetteBlur({ clueCount, isOver })}px)` }}>
            <Silhouette size={160} strokeWidth={1.25} />
          </span>
        )}
      </div>
      <div className={s.caption}>
        {isOver ? <TankIdentity size='lg' tank={identity} /> : <span className={s.hidden}>{t('classified')}</span>}
        <span className={s.hint}>{t(`status.${status}`)}</span>
      </div>
    </Card>
  );
};
