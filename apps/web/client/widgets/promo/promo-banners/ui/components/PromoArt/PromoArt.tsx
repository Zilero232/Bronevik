import { HeavyTankSilhouetteIcon } from '@otmetki/icons';
import { match, P } from 'ts-pattern';

import { TankImage } from '@/ui-kit';

import type { PromoArtProps } from './PromoArt.types';

import { PROMO_ICON } from '../../../config';
import { MockCrosshair, MockDamageLog, MockGear, MockHits, MockManager, MockMarks, MockTeamHp } from './components';

import s from './PromoArt.module.scss';

export const PromoArt = ({ art, tone, variant, isPriority = false }: PromoArtProps) => (
  <div aria-hidden className={s.root} data-kind={art.kind} data-tone={tone} data-variant={variant}>
    {match(art)
      .with({ kind: 'tank', tank: P.nonNullable }, ({ tank }) => (
        <TankImage isDecorative className={s.tank} isPriority={isPriority} size='large' tank={tank} withTint={false} />
      ))
      .with({ kind: 'tank' }, () => <HeavyTankSilhouetteIcon className={s.placeholder} size={PROMO_ICON.placeholder} />)
      .with({ kind: 'emblem' }, ({ icon: Icon }) => (
        <span className={s.emblem}>
          <Icon size={variant === 'hero' ? PROMO_ICON.emblemHero : PROMO_ICON.emblemTile} />
        </span>
      ))
      .with({ kind: 'mock' }, ({ mock }) => (
        <div className={s.mock}>
          {match(mock)
            .with('manager', () => <MockManager />)
            .with('marks', () => <MockMarks />)
            .with('teamHp', () => <MockTeamHp />)
            .with('damageLog', () => <MockDamageLog />)
            .with('crosshair', () => <MockCrosshair />)
            .with('gear', () => <MockGear />)
            .with('hits', () => <MockHits />)
            .exhaustive()}
        </div>
      ))
      .exhaustive()}
  </div>
);
