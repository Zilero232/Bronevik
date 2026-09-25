'use client';

import { TreeExplorer, TreeHero } from './components';

import s from './TreePage.module.scss';

export const TreePage = () => (
  <div className={s.root}>
    <TreeHero />
    <div className={s.body}>
      <TreeExplorer />
    </div>
  </div>
);
