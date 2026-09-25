'use client';

import { CalculatorNav, CalculatorPanel, ToolsHero } from './components';

import s from './ToolsPage.module.scss';

export const ToolsPage = () => (
  <div className={s.root}>
    <ToolsHero />
    <div className={s.sections}>
      <CalculatorNav />
      <CalculatorPanel />
    </div>
  </div>
);
