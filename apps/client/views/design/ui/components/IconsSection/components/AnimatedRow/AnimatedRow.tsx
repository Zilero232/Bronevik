'use client';

import { AnimatedCrosshair, AnimatedLogo, AnimatedMarkOfExcellence, AnimatedMastery } from '@otmetki/icons';
import { useCounter } from '@siberiacancode/reactuse';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/ui-kit';

import { DESIGN_ICONS } from '../../../../../config';
import { DesignRow } from '../../../DesignRow';

import s from './AnimatedRow.module.scss';

export const AnimatedRow = () => {
  const t = useTranslations('design.icons');
  const replay = useCounter(0);

  return (
    <DesignRow label={t('groups.animated')}>
      <div key={replay.value} className={s.animated}>
        <AnimatedLogo size={DESIGN_ICONS.animatedSize} strokeWidth={DESIGN_ICONS.animatedStroke} />
        <AnimatedMarkOfExcellence marks={3} size={DESIGN_ICONS.animatedSize} strokeWidth={DESIGN_ICONS.animatedStroke} />
        <AnimatedMastery tinted level='master' size={DESIGN_ICONS.animatedSize} strokeWidth={DESIGN_ICONS.animatedStroke} />
        <AnimatedMastery tinted level='first' size={DESIGN_ICONS.animatedSize} strokeWidth={DESIGN_ICONS.animatedStroke} />
        <AnimatedCrosshair size={DESIGN_ICONS.animatedSize} strokeWidth={DESIGN_ICONS.animatedStroke} />
      </div>
      <Button size='sm' variant='secondary' onClick={() => replay.inc()}>
        <RotateCcw size={14} />
        {t('replay')}
      </Button>
    </DesignRow>
  );
};
