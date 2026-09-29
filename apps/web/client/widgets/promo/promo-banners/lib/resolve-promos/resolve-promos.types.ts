import type { VehicleSummary } from '@otmetki/schemas';
import type { ComponentType } from 'react';

export type PromoTone = 'accent' | 'battle' | 'brass' | 'gold' | 'olive' | 'sky' | 'steel';

type PromoFamily = 'mod' | 'site';

type PromoMock = 'crosshair' | 'damageLog' | 'gear' | 'hits' | 'manager' | 'marks' | 'teamHp';

type PromoIcon = ComponentType<{ size?: number | string; className?: string }>;

type PromoArtSpec = { kind: 'emblem'; icon: PromoIcon } | { kind: 'mock'; mock: PromoMock } | { kind: 'tank'; pick: number };

export type PromoSpec = {
  href: string;
  tankHref?: (slug: string) => string;
  tone: PromoTone;
  family: PromoFamily;
  requires?: 'modpack';
  art: PromoArtSpec;
};

type PromoState = 'live' | 'soon';

export type PromoArt = { kind: 'emblem'; icon: PromoIcon } | { kind: 'mock'; mock: PromoMock } | { kind: 'tank'; tank: VehicleSummary | null };

export type ResolvedPromo<Id extends string = string> = {
  id: Id;
  href: string;
  tone: PromoTone;
  family: PromoFamily;
  state: PromoState;
  art: PromoArt;
};

export type ResolvePromosInput<Id extends string> = {
  ids: readonly Id[];
  specs: Readonly<Record<Id, PromoSpec>>;
  isModpackPublished: boolean;
  tanks: readonly VehicleSummary[];
};
