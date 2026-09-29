'use client';

import { BRONYA_INDEX, EFF, MASTERY_PERCENTILES, MOE, moeAlpha, WN8 } from '@otmetki/ratings';
import { useFormatter, useTranslations } from 'next-intl';

import type { MethodSectionData } from './use-ratings-method.types';

import { RATINGS_PAGE } from '../../../config';
import { scaleRows } from '../../../lib/scale-rows';

export const useRatingsMethod = () => {
  const t = useTranslations('methodology.sections');
  const format = useFormatter();

  const percent = (share: number) => Math.round(share * RATINGS_PAGE.percent);
  const [one, two, three] = MOE.markPercents;
  const weights = BRONYA_INDEX.weights;

  const sections: MethodSectionData[] = [
    {
      id: 'wn8',
      title: t('wn8.title'),
      lead: t('wn8.lead'),
      lines: [
        t('wn8.lines.ratios'),
        t('wn8.lines.win', { floor: WN8.floor.win }),
        t('wn8.lines.damage', { floor: WN8.floor.damage }),
        t('wn8.lines.frag', { floor: WN8.floor.frag, cap: WN8.cap.fragOverDamage }),
        t('wn8.lines.spot', { floor: WN8.floor.spot, cap: WN8.cap.spotOverDamage }),
        t('wn8.lines.def', { floor: WN8.floor.def, cap: WN8.cap.defOverDamage }),
        t('wn8.lines.total', {
          damage: WN8.weight.damage,
          damageFrag: WN8.weight.damageFrag,
          fragSpot: WN8.weight.fragSpot,
          defFrag: WN8.weight.defFrag,
          win: WN8.weight.win,
          winCap: WN8.cap.win
        })
      ],
      notes: [t('wn8.notes.account'), t('wn8.notes.expected')]
    },
    {
      id: 'eff',
      title: t('eff.title'),
      lead: t('eff.lead'),
      lines: [
        t('eff.lines.total', {
          numerator: EFF.damageTierNumerator,
          offset: EFF.damageTierOffset,
          base: EFF.damageBase,
          slope: EFF.damageTierSlope,
          frag: EFF.fragWeight,
          spot: EFF.spotWeight,
          logBase: EFF.captureLogBase,
          capture: EFF.captureWeight,
          defence: EFF.defenceWeight
        })
      ],
      notes: [t('eff.notes.tier')]
    },
    {
      id: 'bronyaIndex',
      title: t('bronyaIndex.title'),
      lead: t('bronyaIndex.lead'),
      lines: [
        t('bronyaIndex.lines.percentiles', { levels: format.list(BRONYA_INDEX.quantileLevels.map((level) => format.number(percent(level)))) }),
        t('bronyaIndex.lines.score', {
          damage: percent(weights.damage),
          winRate: percent(weights.winRate),
          frags: percent(weights.frags),
          spotted: percent(weights.spotted),
          defence: percent(weights.defence)
        }),
        t('bronyaIndex.lines.shrink', { prior: BRONYA_INDEX.priorBattles, neutral: BRONYA_INDEX.neutralScore }),
        t('bronyaIndex.lines.account', { scale: BRONYA_INDEX.scale })
      ],
      notes: [t('bronyaIndex.notes.confidence', { prior: BRONYA_INDEX.priorBattles })]
    },
    {
      id: 'marks',
      title: t('marks.title'),
      lead: t('marks.lead'),
      lines: [
        t('marks.lines.combined'),
        t('marks.lines.ema', { battles: MOE.emaBattles, alpha: moeAlpha() }),
        t('marks.lines.thresholds', { one, two, three }),
        t('marks.lines.interpolation', { two, three, max: MOE.maxPercent })
      ],
      notes: [t('marks.notes.sources')]
    },
    {
      id: 'mastery',
      title: t('mastery.title'),
      lead: t('mastery.lead'),
      lines: [t('mastery.lines.levels', MASTERY_PERCENTILES)],
      notes: [t('mastery.notes.window')]
    }
  ];

  return { sections, scale: scaleRows() };
};
