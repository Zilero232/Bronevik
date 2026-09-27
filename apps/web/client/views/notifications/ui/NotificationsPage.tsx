'use client';

import { InboxFeed, NotificationsHero, PushCard, SettingsPanel } from './components';

import s from './NotificationsPage.module.scss';

export const NotificationsPage = () => (
  <div className={s.root}>
    <NotificationsHero />
    <div className={s.layout}>
      <div className={s.feed}>
        <InboxFeed />
      </div>
      <aside className={s.settings}>
        <PushCard />
        <SettingsPanel />
      </aside>
    </div>
  </div>
);
