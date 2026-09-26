'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankLink, TankStatusBadge } from '@/entities/tank/tank';
import { Card, CardHeader } from '@/ui-kit';

import { TANK_PAGE, TANK_SECTIONS } from '../../../config';
import { useTank } from '../../../model/context';

import s from './ObtainSection.module.scss';

export const ObtainSection = () => {
  const t = useTranslations('tank.obtain');
  const tSource = useTranslations('tankTraits.source');
  const format = useFormatter();
  const { detail } = useTank();

  const { obtain } = detail;

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
          <p className={s.muted}>{t('unavailable')}</p>
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
        {obtain.offers.total > 0 && (
          <div className={s.block}>
            <h3 className={s.title}>{t('offers', { count: obtain.offers.total })}</h3>
            <ul className={s.list}>
              {obtain.offers.items.map((offer) => (
                <li key={`${offer.title}-${offer.lastSeenAt}`} className={s.row}>
                  {offer.url ? (
                    <a className={s.link} href={offer.url} rel='noreferrer' target='_blank'>
                      {offer.title}
                    </a>
                  ) : (
                    <span>{offer.title}</span>
                  )}
                  <span className={s.value}>{format.dateTime(new Date(offer.startsAt ?? offer.lastSeenAt), { dateStyle: 'medium' })}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {obtain.news.length > 0 && (
          <div className={s.block}>
            <h3 className={s.title}>{t('news')}</h3>
            <ul className={s.list}>
              {obtain.news.map((item) => (
                <li key={item.url} className={s.row}>
                  <a className={s.link} href={item.url} rel='noreferrer' target='_blank'>
                    {item.title}
                  </a>
                  <span className={s.value}>{format.dateTime(new Date(item.publishedAt), { dateStyle: 'medium' })}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p className={s.note}>{t('note')}</p>
    </Card>
  );
};
