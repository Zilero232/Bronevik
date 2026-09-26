'use client';

import { match } from 'ts-pattern';

import { TOOLS_LAYOUT } from '../../../config';
import { useActiveCalculator } from '../../../model/hooks';
import { BattlePassCalculator } from '../BattlePassCalculator';
import { CrewCalculator } from '../CrewCalculator';
import { EconomyCalculator } from '../EconomyCalculator';
import { GoldCalculator } from '../GoldCalculator';
import { MoeCalculator } from '../MoeCalculator';
import { ResearchCalculator } from '../ResearchCalculator';
import { TargetCalculator } from '../TargetCalculator';

export const CalculatorPanel = () => {
  const [active] = useActiveCalculator();

  return (
    <section id={TOOLS_LAYOUT.panelId}>
      {match(active)
        .with('research', () => <ResearchCalculator />)
        .with('target', () => <TargetCalculator />)
        .with('moe', () => <MoeCalculator />)
        .with('crew', () => <CrewCalculator />)
        .with('economy', () => <EconomyCalculator />)
        .with('gold', () => <GoldCalculator />)
        .with('pass', () => <BattlePassCalculator />)
        .exhaustive()}
    </section>
  );
};
