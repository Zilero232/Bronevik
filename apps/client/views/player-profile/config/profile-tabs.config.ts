import type { ComponentType } from 'react';

import { HeavyTankIcon, Mark3Icon } from '@bronevik/icons';
import { CalendarDays, ChartSpline, History, LayoutDashboard, Lightbulb } from 'lucide-react';

import type { PROFILE_TABS } from './profile.config';

export type ProfileTab = (typeof PROFILE_TABS)[number];

export const PROFILE_TAB_ICONS: Record<ProfileTab, ComponentType<{ size?: number | string }>> = {
  overview: LayoutDashboard,
  tanks: HeavyTankIcon,
  sessions: CalendarDays,
  marks: Mark3Icon,
  charts: ChartSpline,
  insights: Lightbulb,
  history: History
};
