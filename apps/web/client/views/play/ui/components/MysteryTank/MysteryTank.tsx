'use client';

import { TANK_CLASS_SILHOUETTES } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { TankIdentity } from '@/entities/tank/tank';
import { Card, TankImage } from '@/ui-kit';

import { useMysteryTank } from '../../../model/hooks';

import s from './MysteryTank.module.scss';

export const MysteryTank = () => {
  const t = useTranslations('play.mystery');
  const { status, isOver, identity, tankClass, blur } = useMysteryTank();

  const Silhouette = TANK_CLASS_SILHOUETTES[tankClass];

  return (
    <Card className={s.root} data-status={status} variant='panel'>
      <div className={s.stage}>
        {isOver ? (
          <TankImage isDecorative size='big' tank={identity} />
        ) : (
          <span aria-hidden className={s.silhouette} style={{ filter: blur }}>
            <Silhouette size={160} strokeWidth={1.25} />
          </span>
        )}
      </div>
      <div className={s.caption}>
        {isOver ? <TankIdentity size='lg' tank={identity} /> : <span className={s.hidden}>{t('classified')}</span>}
        <span className={s.hint} role='status'>
          {t(`status.${status}`)}
        </span>
      </div>
    </Card>
  );
};
