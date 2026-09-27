'use client';

import {
  BuildStage,
  CrewBand,
  EquipmentMatrix,
  FieldModRing,
  ShellMix,
  ShowcaseActions,
  ShowcaseCompare,
  ShowcaseNotice,
  ShowcaseSections,
  ShowcaseStats,
  SourceToggle
} from './components';

import s from './BuildShowcase.module.scss';

export const BuildShowcase = () => (
  <div className={s.root}>
    <BuildStage
      actions={<ShowcaseActions />}
      compare={<ShowcaseCompare />}
      left={<FieldModRing side='left' />}
      notice={<ShowcaseNotice />}
      right={<FieldModRing side='right' />}
      stats={<ShowcaseStats />}
      toggle={<SourceToggle />}
    />
    <ShowcaseSections>
      <CrewBand />
      <EquipmentMatrix />
      <ShellMix />
    </ShowcaseSections>
  </div>
);
