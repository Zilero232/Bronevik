import { toRoman } from '@otmetki/icons';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { TierNumeralProps } from './TierNumeral.types';

import { TIER_NUMERAL } from './TierNumeral.constants';

import s from './TierNumeral.module.scss';

export const TierNumeral = ({ tier, className }: TierNumeralProps) => {
  const t = useTranslations('common');

  return (
    <abbr className={clsx(s.root, className)} data-top={tier >= TIER_NUMERAL.topFrom} title={t('tier', { tier })}>
      {toRoman(tier)}
    </abbr>
  );
};
