import { match } from 'ts-pattern';

import type { ProfileTabContentProps } from './ProfileTabContent.types';

import { AchievementsTab } from '../AchievementsTab';
import { ChartsTab } from '../ChartsTab';
import { HistoryTab } from '../HistoryTab';
import { InsightsTab } from '../InsightsTab';
import { MarksTab } from '../MarksTab';
import { ModesTab } from '../ModesTab';
import { OverviewTab } from '../OverviewTab';
import { SessionsTab } from '../SessionsTab';
import { TanksFilterProvider } from '../TanksFilterProvider';
import { TanksTab } from '../TanksTab';

export const ProfileTabContent = ({ tab }: ProfileTabContentProps) =>
  match(tab)
    .with('overview', () => <OverviewTab />)
    .with('tanks', () => (
      <TanksFilterProvider>
        <TanksTab />
      </TanksFilterProvider>
    ))
    .with('sessions', () => <SessionsTab />)
    .with('marks', () => <MarksTab />)
    .with('achievements', () => <AchievementsTab />)
    .with('modes', () => <ModesTab />)
    .with('charts', () => <ChartsTab />)
    .with('insights', () => <InsightsTab />)
    .with('history', () => <HistoryTab />)
    .exhaustive();
