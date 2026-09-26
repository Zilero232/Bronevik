import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Band, MediaCard } from '@/ui-kit';

import { HOME_COMMUNITY, HOME_ICON } from '../../../config';

import s from './CommunityBand.module.scss';

export const CommunityBand = () => {
  const t = useTranslations('home.community');

  return (
    <Band aria-labelledby='home-community' innerClassName={s.inner}>
      <h2 className={s.title} id='home-community'>
        {t('title')}
      </h2>
      <ul className={s.grid}>
        {HOME_COMMUNITY.map(({ key, href, icon: Icon }) => (
          <li key={key} className={s.item}>
            <MediaCard
              media={
                <span className={s.media} data-kind={key}>
                  <Icon className={s.emblem} size={HOME_ICON.community} />
                </span>
              }
              aspect='wide'
              href={href}
              sub={t(`${key}.description`)}
              subIcon={<ArrowRight size={12} />}
              title={t(`${key}.title`)}
            />
          </li>
        ))}
      </ul>
    </Band>
  );
};
