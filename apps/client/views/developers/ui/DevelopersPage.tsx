import { ApiReference, ApiTerms, DevelopersHeader, LimitFigures, Quickstart, TiersTable, WebhooksDocs } from './components';

import s from './DevelopersPage.module.scss';

export const DevelopersPage = () => (
  <div className={s.root}>
    <DevelopersHeader />
    <LimitFigures />
    <Quickstart />
    <ApiReference />
    <WebhooksDocs />
    <TiersTable />
    <ApiTerms />
  </div>
);
