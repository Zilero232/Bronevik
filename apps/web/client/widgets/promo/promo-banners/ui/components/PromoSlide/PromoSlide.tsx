import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { PromoSlideProps } from './PromoSlide.types';

import { PROMO_ICON } from '../../../config';
import { PromoArt } from '../PromoArt';
import { PromoKicker } from '../PromoKicker';

import s from './PromoSlide.module.scss';

export const PromoSlide = ({ promo, hasCta, isPriority }: PromoSlideProps) => {
  const t = useTranslations('promo');

  return (
    <article className={s.root} data-family={promo.family} data-state={promo.state} data-tone={promo.tone}>
      <span aria-hidden className={s.grunge} />
      <span aria-hidden className={s.grid} />
      <span aria-hidden className={s.rings} />
      <span aria-hidden className={s.arc} />
      <div className={s.copy}>
        <p className={s.kicker}>
          <span className={s.kickerText}>
            <PromoKicker promo={promo} />
          </span>
        </p>
        <h3 className={s.title}>{t(`items.${promo.id}.title`)}</h3>
        <p className={s.lead}>{t.rich(`items.${promo.id}.lead`, { hl: (chunks) => <mark className={s.hl}>{chunks}</mark> })}</p>
        {hasCta && (
          <Link className={buttonVariants({ variant: 'primary', size: 'lg', shine: promo.state === 'live' })} href={promo.href}>
            {promo.state === 'soon' ? t('soonCta') : t(`items.${promo.id}.cta`)}
            <ArrowRight aria-hidden size={PROMO_ICON.arrow} />
          </Link>
        )}
      </div>
      <div className={s.art}>
        <PromoArt art={promo.art} isPriority={isPriority} tone={promo.tone} variant='hero' />
      </div>
    </article>
  );
};
