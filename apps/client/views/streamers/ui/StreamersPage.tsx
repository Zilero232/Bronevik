'use client';

import { FlowSection, StreamersCta, StreamersHero, ToolsSection } from './components';

import s from './StreamersPage.module.scss';

export const StreamersPage = () => (
  <div className={s.root}>
    <StreamersHero />
    <ToolsSection />
    <FlowSection />
    <StreamersCta />
  </div>
);
