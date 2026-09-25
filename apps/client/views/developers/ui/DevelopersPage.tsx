import { DevelopersHero, EndpointExplorer, PlanCards, Quickstart, Showcase, WebhooksDocs } from './components';

import s from './DevelopersPage.module.scss';

export const DevelopersPage = () => (
  <div className={s.root}>
    <DevelopersHero />
    <div className={s.sections}>
      <PlanCards />
      <Quickstart />
      <EndpointExplorer />
      <WebhooksDocs />
      <Showcase />
    </div>
  </div>
);
