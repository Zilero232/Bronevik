import { Check } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';
import { ProgressBar } from '@/ui-kit';

import type { ChallengeSetProps } from './ChallengeSet.types';

import s from './ChallengeSet.module.scss';

export const ChallengeSet = ({ tankId, vehicle, items }: ChallengeSetProps) => {
  const t = useTranslations('progression.challenges');
  const format = useFormatter();

  return (
    <section className={s.root}>
      <div className={s.tank}>{vehicle ? <TankCell image='contour' vehicle={vehicle} /> : <span className={s.unknown}>#{tankId}</span>}</div>
      <ul className={s.list}>
        {items.map((item) => (
          <li key={item.code} className={s.item} data-done={item.completedAt !== null}>
            <div className={s.head}>
              <span className={s.title}>
                {t(`metric.${item.metric}`, { target: format.number(item.target), threshold: format.number(item.threshold ?? 0) })}
              </span>
              {item.completedAt ? (
                <span className={s.done}>
                  <Check size={13} />
                  {t('done')}
                </span>
              ) : (
                <span className={s.reward}>{t('reward', { shells: item.shells, points: item.points })}</span>
              )}
            </div>
            <ProgressBar
              max={item.target}
              size='sm'
              tone={item.completedAt ? 'good' : 'accent'}
              value={item.progress}
              valueLabel={t('progress', { value: format.number(item.progress), target: format.number(item.target) })}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
