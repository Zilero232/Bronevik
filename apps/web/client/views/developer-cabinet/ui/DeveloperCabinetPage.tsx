'use client';

import { ApiKeysPanel, CabinetHeader, UsagePanel, WebhooksPanel } from './components';

import s from './DeveloperCabinetPage.module.scss';

export const DeveloperCabinetPage = () => (
  <div className={s.root}>
    <CabinetHeader />
    <ApiKeysPanel />
    <UsagePanel />
    <WebhooksPanel />
  </div>
);
