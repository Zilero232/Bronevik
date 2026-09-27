import { toRoman } from '@otmetki/icons';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { tierBand } from '@/shared/lib';

import type { TierNumeralProps } from './TierNumeral.types';

import { TIER_NUMERAL } from './TierNumeral.constants';

import s from './TierNumeral.module.scss';

export const TierNumeral = ({ tier, variant = 'plain', className }: TierNumeralProps) => {
  const t = useTranslations('common');

  return (
    <abbr
      className={clsx(s.root, s[variant], className)}
      data-tier-band={tierBand(tier)}
      data-top={tier >= TIER_NUMERAL.topFrom}
      title={t('tier', { tier })}
    >
      {variant === 'hex' && (
        <svg aria-hidden className={s.hexShape} viewBox={TIER_NUMERAL.hexViewBox}>
          <polygon points={TIER_NUMERAL.hexPoints} />
        </svg>
      )}
      <span className={s.numeral}>{toRoman(tier)}</span>
    </abbr>
  );
};
