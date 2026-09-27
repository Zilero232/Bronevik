'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { TankShowcaseCard } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Band, buttonVariants, Reveal } from '@/ui-kit';

import type { WrappedChaptersProps } from './WrappedChapters.types';

import { WrappedFact } from './components';

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
              .with('tanks', () => (
                <ol className={s.tanks}>
                  {topTanks.map(({ tankId, place, battles, damageDealt, vehicle }) => (
                    <li key={tankId}>
                      {vehicle ? (
                        <TankShowcaseCard
                          figures={[
                            { id: 'battles', label: t('tanks.battles'), value: format.number(battles, 'integer') },
                            { id: 'damage', label: t('tanks.damage'), value: format.number(damageDealt, 'compact') }
                          ]}
                          href={ROUTES.tanks.detail(vehicle.slug)}
                          meta={t('tanks.place', { place })}
                          vehicle={vehicle}
                        />
                      ) : (
                        <WrappedFact label={t('tanks.place', { place })} value={battles} />
                      )}
                    </li>
                  ))}
                </ol>
              ))
              .with('marks', () => (
                <div className={s.facts}>
                  <WrappedFact isHero label={t('marks.marks')} value={wrapped.marksGained} />
                  <WrappedFact label={t('marks.masteries')} value={wrapped.masteriesGained} />
                  <WrappedFact label={t('marks.badges')} value={wrapped.badges.length} />
                </div>
              ))
              .with('best', () =>
                wrapped.bestBattle ? (
                  <div className={s.best}>
                    {bestVehicle && (
                      <TankShowcaseCard
                        href={ROUTES.tanks.detail(bestVehicle.slug)}
                        layout='row'
                        meta={format.dateTime(new Date(wrapped.bestBattle.at), 'date')}
                        vehicle={bestVehicle}
                      />
                    )}
                    <div className={s.facts}>
                      <WrappedFact isHero label={t('best.damage')} value={wrapped.bestBattle.damageDealt} />
                      <WrappedFact label={t('best.frags')} value={wrapped.bestBattle.frags} />
                    </div>
                    {wrapped.bestBattle.replayId && (
                      <Link
                        className={buttonVariants({ variant: 'secondary', size: 'sm' })}
                        href={ROUTES.replays.detail(wrapped.bestBattle.replayId)}
                      >
                        {t('best.replay')}
                      </Link>
                    )}
                  </div>
                ) : null
              )
              .exhaustive()}
          </Reveal>
        </Band>
      ))}
    </div>
  );
};
