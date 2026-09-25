import type { ComponentType } from 'react';

import { ArmorIcon, CrosshairIcon, RadioIcon } from '@bronevik/icons';
import { Cog, Cpu, EyeOff, Flame, Gauge, GitFork, Package, RotateCw, ScrollText, Users, Wrench } from 'lucide-react';

import type { BuildCategory, BuildModuleSlot } from '../lib/build-catalog';

export type BuildIcon = ComponentType<{ size?: number | string; strokeWidth?: number | string }>;

export const CATEGORY_ICONS = {
  firepower: CrosshairIcon,
  mobility: Gauge,
  survivability: ArmorIcon,
  stealth: EyeOff
} as const satisfies Record<BuildCategory, BuildIcon>;

export const MODULE_ICONS = {
  gun: CrosshairIcon,
  turret: RotateCw,
  engine: Flame,
  chassis: Cog,
  radio: RadioIcon
} as const satisfies Record<BuildModuleSlot, BuildIcon>;

export const PANEL_ICONS = {
  equipment: Package,
  consumables: Wrench,
  directives: ScrollText,
  modules: Cpu,
  crew: Users,
  fieldMods: GitFork
} as const satisfies Record<string, BuildIcon>;
