'use client';

import { useTranslations } from 'next-intl';

import { useBuildContext } from '../../../model/context';
import { BuildHead } from '../BuildHead';
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
  const t = useTranslations('common');
  const { side } = useBuildContext();

  return (
    <div className={s.root} data-side={side}>
      <BuildHead />
      <LoadoutBar />
      <PresetStrip />
      <div className={s.layout}>
        <div className={s.panels}>
          <SlotsPanel field='equipment' />
          <ModulesPanel />
          <div className={s.pair}>
            <SlotsPanel field='consumables' />
            <SlotsPanel field='directives' />
          </div>
          <CrewPanel />
          <FieldModsPanel />
          <p className={s.source}>{t('dataSource')}</p>
        </div>
        <aside className={s.aside}>
          <StatsBoard />
        </aside>
      </div>
      <MobileStats />
    </div>
  );
};
