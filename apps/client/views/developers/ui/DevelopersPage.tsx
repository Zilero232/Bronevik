import { ApiReference, DevelopersHeader, LimitFigures, PlansTable, Quickstart, WebhooksDocs } from './components';

import s from './DevelopersPage.module.scss';

export const DevelopersPage = () => (
  <div className={s.root}>
    <DevelopersHeader />
    <LimitFigures />
    <Quickstart />
    <ApiReference />
    <WebhooksDocs />
    <PlansTable />
  </div>
);
