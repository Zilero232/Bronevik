import { ExternalLink } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { EXTERNAL_LINKS } from '@/shared/config';

import { MOD_FAIR_PLAY, MOD_PAGE } from '../../../../../config';

import s from './BanFigure.module.scss';

export const BanFigure = () => {
  const t = useTranslations('mod.fairPlay.bans');
  const format = useFormatter();

  return (
    <figure className={s.root}>
      <p className={s.figure}>
        <span className={s.value}>{format.number(MOD_FAIR_PLAY.bans.total)}</span>
        <span className={s.label}>{t('label')}</span>
      </p>
      <figcaption className={s.text}>{t('text')}</figcaption>
      <ul className={s.tiers}>
        {MOD_FAIR_PLAY.bans.tiers.map(({ id, count }) => (
          <li key={id} className={s.tier}>
            <span className={s.count}>{format.number(count)}</span>
            <span>{t(`tiers.${id}`)}</span>
          </li>
        ))}
      </ul>
      <p className={s.links}>
        <a className={s.link} href={EXTERNAL_LINKS.lestaFairPlayReport} rel='noreferrer' target='_blank'>
          {t('source')}
          <ExternalLink aria-hidden size={MOD_PAGE.smallIconSize} />
        </a>
        <a className={s.link} href={EXTERNAL_LINKS.lestaForbiddenMods} rel='noreferrer' target='_blank'>
          {t('rules')}
          <ExternalLink aria-hidden size={MOD_PAGE.smallIconSize} />
        </a>
      </p>
    </figure>
  );
};
