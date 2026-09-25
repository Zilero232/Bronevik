'use client';

import { motion } from 'motion/react';

import { STAGGER } from '@/shared/lib';

import { useBuildContext } from '../../../model/context';
import { BuildHero } from '../BuildHero';
import { CrewPanel } from '../CrewPanel';
import { FieldModsPanel } from '../FieldModsPanel';
import { LoadoutBar } from '../LoadoutBar';
import { MobileStats } from '../MobileStats';
import { ModulesPanel } from '../ModulesPanel';
import { PresetStrip } from '../PresetStrip';
import { SlotsPanel } from '../SlotsPanel';
import { StatsBoard } from '../StatsBoard';

import s from './BuildWorkspace.module.scss';

export const BuildWorkspace = () => {
  const { side } = useBuildContext();

  return (
    <div className={s.root} data-side={side}>
      <BuildHero />
      <LoadoutBar />
      <PresetStrip />
      <div className={s.layout}>
        <motion.div animate='visible' className={s.panels} initial='hidden' variants={STAGGER}>
          <SlotsPanel field='equipment' index='// 02' />
          <ModulesPanel />
          <div className={s.pair}>
            <SlotsPanel field='consumables' index='// 04' />
            <SlotsPanel field='directives' index='// 05' />
          </div>
          <CrewPanel />
          <FieldModsPanel />
        </motion.div>
        <aside className={s.aside}>
          <StatsBoard />
        </aside>
      </div>
      <MobileStats />
    </div>
  );
};
