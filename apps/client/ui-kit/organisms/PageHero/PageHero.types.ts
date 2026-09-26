import type { ReactNode } from 'react';

import type { TankImageSubject } from '../../atoms';
import type { BattleBackdropTone } from '../BattleBackdrop';
import type { PageBreadcrumb } from '../PageHeader';

export type PageHeroArt =
  | { kind: 'clan'; emblem: string | null; color?: string | null }
  | { kind: 'emblem'; glyph: ReactNode }
  | { kind: 'flag'; nation: string }
  | { kind: 'tanks'; tanks: readonly TankImageSubject[] };

export type PageHeroProps = {
  title: ReactNode;
  eyebrow?: ReactNode;
  breadcrumbs?: PageBreadcrumb[];
  lead?: ReactNode;
  art?: PageHeroArt;
  figures?: ReactNode;
  actions?: ReactNode;
  backdrop?: false | BattleBackdropTone;
  backdropSeed?: number;
  className?: string;
};
