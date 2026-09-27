import type { ReactNode } from 'react';

import type { SettingsGroupView } from '../../../lib/settings-page';

export type SettingsGroupPanelProps = {
  group: SettingsGroupView;
  children?: ReactNode;
};
