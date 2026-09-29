import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { PromoTileProps } from './PromoTile.types';

import { PROMO_ICON } from '../../../config';
import { PromoArt } from '../PromoArt';
import { PromoKicker } from '../PromoKicker';

import s from './PromoTile.module.scss';

export const PromoTile = ({ promo }: PromoTileProps) => {
  const t = useTranslations('promo');

  return (
    <article className={s.root} data-art={promo.art.kind} data-state={promo.state} data-tone={promo.tone}>
      <span aria-hidden className={s.texture} />
      <div className={s.art}>
        <PromoArt art={promo.art} tone={promo.tone} variant='tile' />
      </div>
      <div className={s.copy}>
        <p className={s.kicker}>
          <PromoKicker promo={promo} />
        </p>
        <h3 className={s.title}>{t(`items.${promo.id}.title`)}</h3>
        <Link className={clsx(buttonVariants({ variant: 'secondary', size: 'sm' }), s.cta)} href={promo.href}>
          {promo.state === 'soon' ? t('soonCta') : t(`items.${promo.id}.cta`)}
          <ArrowRight aria-hidden size={PROMO_ICON.control} />
        </Link>
      </div>
      <span aria-hidden className={s.torn} />
    </article>
  );
};
