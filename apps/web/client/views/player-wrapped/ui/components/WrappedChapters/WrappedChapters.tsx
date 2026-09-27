'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Band, Reveal } from '@/ui-kit';

import type { WrappedChaptersProps } from './WrappedChapters.types';

import { WrappedBest, WrappedFact, WrappedTanks } from './components';

import s from './WrappedChapters.module.scss';

export const WrappedChapters = ({ wrapped, chapters, topTanks, bestVehicle }: WrappedChaptersProps) => {
  const t = useTranslations('wrapped.chapters');
  const format = useFormatter();

  return (
    <div className={s.root}>
      {chapters.map((chapter, index) => (
        <Band key={chapter} aria-labelledby={`wrapped-${chapter}`} innerClassName={s.inner} tone={index % 2 === 0 ? 'deep' : 'raised'}>
          <Reveal className={s.chapter}>
            <span className={s.step}>{t('step', { index: index + 1, total: chapters.length })}</span>
            <h2 className={s.title} id={`wrapped-${chapter}`}>
              {t(`${chapter}.title`)}
            </h2>
            {match(chapter)
              .with('activity', () => (
                <div className={s.facts}>
                  <WrappedFact isHero label={t('activity.battles')} value={wrapped.battles} />
                  <WrappedFact label={t('activity.wins')} value={wrapped.wins} />
                  <WrappedFact label={t('activity.sessions')} value={wrapped.sessions} />
                  {wrapped.busiestMonth !== null && (
                    <WrappedFact
                      label={t('activity.busiestMonth')}
                      value={format.dateTime(new Date(Date.UTC(wrapped.year, wrapped.busiestMonth - 1, 1)), { month: 'long', timeZone: 'UTC' })}
                    />
                  )}
                </div>
              ))
              .with('damage', () => (
                <div className={s.facts}>
                  <WrappedFact isHero label={t('damage.total')} value={wrapped.damageDealt} />
                  <WrappedFact label={t('damage.average')} value={wrapped.avgDamage === null ? '—' : Math.round(wrapped.avgDamage)} />
                  <WrappedFact label={t('damage.frags')} value={wrapped.frags} />
                </div>
              ))
              .with('tanks', () => <WrappedTanks topTanks={topTanks} />)
              .with('marks', () => (
                <div className={s.facts}>
                  <WrappedFact isHero label={t('marks.marks')} value={wrapped.marksGained} />
                  <WrappedFact label={t('marks.masteries')} value={wrapped.masteriesGained} />
                  <WrappedFact label={t('marks.badges')} value={wrapped.badges.length} />
                </div>
              ))
              .with('best', () => wrapped.bestBattle && <WrappedBest bestBattle={wrapped.bestBattle} bestVehicle={bestVehicle} />)
              .exhaustive()}
          </Reveal>
        </Band>
      ))}
    </div>
  );
};
