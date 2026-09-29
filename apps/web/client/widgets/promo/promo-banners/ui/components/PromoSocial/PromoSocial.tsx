import { Crown, Download, PackageOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { MOD_DISTRIBUTION, TELEGRAM_BOT } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { PromoSocialProps } from './PromoSocial.types';

import { PROMO_ICON, PROMO_SOCIAL } from '../../../config';

import s from './PromoSocial.module.scss';

export const PromoSocial = ({ isManagerReady }: PromoSocialProps) => {
  const t = useTranslations('promo.social');

  return (
    <div className={s.root}>
      <div className={s.links}>
        <span className={s.label}>{t('label')}</span>
        <ul className={s.list}>
          {PROMO_SOCIAL.map(({ id, href, icon: Icon }) => (
            <li key={id}>
              <a className={s.link} data-network={id} href={href} rel='noreferrer' target='_blank'>
                <span aria-hidden className={s.icon}>
                  <Icon size={PROMO_ICON.social} />
                </span>
                <span className={s.linkText}>
                  <span className={s.linkTitle}>{t(`${id}.title`)}</span>
                  <span className={s.linkHint}>{t(`${id}.hint`, { bot: TELEGRAM_BOT.username })}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className={s.actions}>
        <Link className={buttonVariants({ variant: 'premium', shine: true })} href={ROUTES.plus}>
          <Crown aria-hidden size={PROMO_ICON.control} />
          {t('plus')}
        </Link>
        {isManagerReady ? (
          <a
            className={buttonVariants({ variant: 'primary', shine: true })}
            download={MOD_DISTRIBUTION.managerFileName}
            href={MOD_DISTRIBUTION.managerUrl}
            rel='noreferrer'
            target='_blank'
          >
            <Download aria-hidden size={PROMO_ICON.control} />
            {t('manager')}
          </a>
        ) : (
          <Link className={buttonVariants({ variant: 'secondary' })} href={ROUTES.mod}>
            <PackageOpen aria-hidden size={PROMO_ICON.control} />
            {t('modpack')}
          </Link>
        )}
      </div>
    </div>
  );
};
