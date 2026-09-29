'use client';

import { MasteryIcon } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { SweatBadge } from '@/entities/tank/tank';
import { EmptyState } from '@/ui-kit';

import { MASTERY_LEVELS, TANK_SECTIONS } from '../../../config';
import { useTank } from '../../../model/context';
import { TankSection } from '../TankSection';

import s from './MasteryPanel.module.scss';

export const MasteryPanel = () => {
  const t = useTranslations('tank.mastery');
  const format = useFormatter();
  const { detail } = useTank();

  return (
    <TankSection
      action={detail.sweat.masteryLevel ? <SweatBadge kind='mastery' level={detail.sweat.masteryLevel} ratio={detail.sweat.mastery} /> : null}
      id={TANK_SECTIONS.mastery}
      title={t('title')}
    >
      {detail.mastery ? (
        <ul className={s.list}>
          {MASTERY_LEVELS.map(({ key, level }) => (
            <li key={key} className={s.row} data-level={level}>
              <MasteryIcon aria-hidden tinted level={level} size={20} />
              <span className={s.name}>{t(`levels.${key}`)}</span>
              <span className={s.value}>
                {format.number(detail.mastery?.[key] ?? 0)}
                <span className={s.unit}>{t('xpUnit')}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={t('empty')} />
      )}
      <p className={s.note}>{t('note')}</p>
    </TankSection>
  );
};
