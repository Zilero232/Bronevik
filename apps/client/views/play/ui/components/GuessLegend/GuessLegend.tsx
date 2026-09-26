import { useTranslations } from 'next-intl';

import { GUESS_LEGEND } from '../../../config';

import s from './GuessLegend.module.scss';

export const GuessLegend = () => {
  const t = useTranslations('play.head');

  return (
    <ul aria-label={t('legendLabel')} className={s.root}>
      {GUESS_LEGEND.map((verdict) => (
        <li key={verdict} className={s.item}>
          <span aria-hidden className={s.swatch} data-verdict={verdict} />
          {t(`legend.${verdict}`)}
        </li>
      ))}
    </ul>
  );
};
