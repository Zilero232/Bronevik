import { OtmetkiLogoIcon } from '@otmetki/icons';
import { Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TELEGRAM_BOT } from '@/shared/config';
import { ROUTES, SITE_FOOTER_ACTIONS } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import { FOOTER_ACTION_VARIANT } from '../../../config';

import s from './FooterBand.module.scss';

export const FooterBand = () => {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tBrand = useTranslations('brand');

  return (
    <div className={s.root}>
      <span aria-hidden className={s.texture} />
      <span aria-hidden className={s.emblem}>
        <OtmetkiLogoIcon size={176} strokeWidth={1.5} />
      </span>
      <div className={s.brandBlock}>
        <Link className={s.brand} href={ROUTES.home}>
          <span className={s.mark}>
            <OtmetkiLogoIcon size={26} strokeWidth={2.25} />
          </span>
          <span className={s.word}>{tBrand('name')}</span>
        </Link>
        <p className={s.tagline}>{t('about')}</p>
      </div>
      <ul aria-label={t('actionsLabel')} className={s.actions}>
        {SITE_FOOTER_ACTIONS.map(({ key, href, icon: Icon }) => (
          <li key={key}>
            <Link className={buttonVariants({ variant: FOOTER_ACTION_VARIANT[key], size: 'lg', class: s.action })} href={href}>
              <Icon size={16} />
              {tNav(`items.${key}`)}
            </Link>
          </li>
        ))}
        <li>
          <a className={buttonVariants({ variant: 'ghost', size: 'lg', class: s.action })} href={TELEGRAM_BOT.url} rel='noreferrer' target='_blank'>
            <Send size={16} />
            {t('telegram')}
          </a>
        </li>
      </ul>
    </div>
  );
};
