import { useTranslations } from 'next-intl';

import type { HeaderSeasonsProps } from './HeaderSeasons.types';

import s from './HeaderSeasons.module.scss';

export const HeaderSeasons = ({ seasons }: HeaderSeasonsProps) => {
  const t = useTranslations('profile.header');

  if (seasons.length === 0) {
    return null;
  }

  return (
    <ul aria-label={t('seasons')} className={s.root}>
      {seasons.map(({ season, level }) => (
        <li key={season} className={s.item}>
          {t('seasonLevel', { season: season.toUpperCase(), level })}
        </li>
      ))}
    </ul>
  );
};
