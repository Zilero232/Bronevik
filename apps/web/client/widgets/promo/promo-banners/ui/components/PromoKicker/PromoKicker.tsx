import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import type { PromoKickerProps } from './PromoKicker.types';

export const PromoKicker = ({ promo }: PromoKickerProps) => {
  const t = useTranslations('promo');
  const kicker = t(`items.${promo.id}.kicker`);

  return match(promo)
    .with({ state: 'live' }, () => kicker)
    .with({ family: 'mod' }, () => t('soonMod'))
    .otherwise(() => t('soon', { kicker }));
};
