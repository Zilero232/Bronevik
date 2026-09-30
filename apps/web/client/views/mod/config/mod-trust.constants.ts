import { BadgeRussianRuble, KeyRound, ShieldCheck, ToggleRight } from 'lucide-react';

export const MOD_TRUST = [
  { id: 'fairPlay', icon: ShieldCheck, tone: 'success' },
  { id: 'free', icon: BadgeRussianRuble, tone: 'gold' },
  { id: 'lestaId', icon: KeyRound, tone: 'sky' },
  { id: 'control', icon: ToggleRight, tone: 'accent' }
] as const;
