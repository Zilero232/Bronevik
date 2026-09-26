'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankLink, TankStatusBadge } from '@/entities/tank/tank';
import { Card, CardHeader } from '@/ui-kit';

import { TANK_PAGE, TANK_SECTIONS } from '../../../config';
import { useObtainSection } from '../../../model/hooks';
import { ObtainEditorial, ObtainLinks, ObtainMissions, ReturnAlert } from './components';

import s from './ObtainSection.module.scss';

export const ObtainSection = () => {
  const t = useTranslations('tank.obtain');
  const tSource = useTranslations('tankTraits.source');
  const format = useFormatter();
  const { obtain, offers, news, missions, editorial } = useObtainSection();

  return (
    <Card className={s.root} id={TANK_SECTIONS.obtain} padding='none'>
      <CardHeader action={<TankStatusBadge status={obtain.status} />} className={s.header} title={t('title')} />
      <div className={s.body}>
        {obtain.sources.length > 0 ? (
          <ul className={s.sources}>
            {obtain.sources.map((source) => (
              <li key={source}>{tSource(source)}</li>
            ))}
          </ul>
        ) : (
          missions.length + editorial.length === 0 && <p className={s.muted}>{t('unavailable')}</p>
        )}
        {(obtain.priceCredits !== null || obtain.priceGold !== null) && (
          <p className={s.price}>
            {obtain.priceGold !== null
              ? t('priceGold', { value: format.number(obtain.priceGold) })
              : t('priceCredits', { value: format.number(obtain.priceCredits ?? 0) })}
          </p>
        )}
        {obtain.researchFrom.length > 0 && (
          <div className={s.block}>
            <h3 className={s.title}>{t('researchFrom')}</h3>
            <ul className={s.list}>
              {obtain.researchFrom.map(({ vehicle, xp }) => (
                <li key={vehicle.tankId} className={s.row}>
                  <TankLink image={TANK_PAGE.researchImage} vehicle={vehicle} />
                  {xp !== null && <span className={s.value}>{t('xp', { value: format.number(xp) })}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {missions.length > 0 && <ObtainMissions items={missions} />}
        {editorial.length > 0 && <ObtainEditorial items={editorial} />}
        <ReturnAlert />
        {obtain.offers.total > 0 && <ObtainLinks items={offers} title={t('offers', { count: obtain.offers.total })} />}
        {news.length > 0 && <ObtainLinks items={news} title={t('news')} />}
      </div>
      <p className={s.note}>{t('note')}</p>
    </Card>
  );
};
