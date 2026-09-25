'use client';

import { AnimatePresence, motion } from 'motion/react';
import { match } from 'ts-pattern';

import { FADE } from '@/shared/lib';

import { CALC_PANEL_ID } from '../../../config';
import { useActiveCalculator } from '../../../model/hooks';
import { BattlePassCalculator } from '../BattlePassCalculator';
import { CrewCalculator } from '../CrewCalculator';
import { EconomyCalculator } from '../EconomyCalculator';
import { GoldCalculator } from '../GoldCalculator';
import { MoeCalculator } from '../MoeCalculator';
import { ResearchCalculator } from '../ResearchCalculator';
import { TargetCalculator } from '../TargetCalculator';

import s from './CalculatorPanel.module.scss';

export const CalculatorPanel = () => {
  const [active] = useActiveCalculator();

  return (
    <section aria-live='polite' className={s.root} id={CALC_PANEL_ID}>
      <AnimatePresence initial={false} mode='wait'>
        <motion.div key={active} animate='visible' exit='hidden' initial='hidden' variants={FADE}>
          {match(active)
            .with('research', () => <ResearchCalculator />)
            .with('target', () => <TargetCalculator />)
            .with('moe', () => <MoeCalculator />)
            .with('crew', () => <CrewCalculator />)
            .with('economy', () => <EconomyCalculator />)
            .with('gold', () => <GoldCalculator />)
            .with('pass', () => <BattlePassCalculator />)
            .exhaustive()}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
