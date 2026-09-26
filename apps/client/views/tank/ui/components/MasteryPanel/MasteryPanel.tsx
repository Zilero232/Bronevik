'use client';

import { MasteryIcon } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { SweatBadge } from '@/entities/tank/tank';
import { Card, CardHeader, EmptyState } from '@/ui-kit';

import { MASTERY_LEVELS, TANK_SECTIONS } from '../../../config';
import { useTank } from '../../../model/context';

import s from './MasteryPanel.module.scss';

export const MasteryPanel = () => {
  const t = useTranslations('tank.mastery');
  const format = useFormatter();
  const { detail } = useTank();

  return (
    <Card className={s.root} id={TANK_SECTIONS.mastery} padding='none'>
      <CardHeader
        action={detail.sweat.masteryLevel ? <SweatBadge kind='mastery' level={detail.sweat.masteryLevel} ratio={detail.sweat.mastery} /> : null}
        className={s.header}
        title={t('title')}
      />
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
    </Card>
  );
};
