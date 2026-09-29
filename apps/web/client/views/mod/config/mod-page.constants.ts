import { Mark3Icon } from '@otmetki/icons';
import { Gauge, History, ScrollText } from 'lucide-react';

import { ROUTES } from '@/shared/constants';

export const MOD_PAGE = {
  heroGlyph: 480,
  iconSize: 18,
  featureIconSize: 22,
  bytesPerMegabyte: 1_048_576,
  featuresAnchor: 'features'
} as const;

export const MOD_FEATURES = [
  { key: 'results', icon: ScrollText, tone: 'sky' },
  { key: 'marks', icon: Mark3Icon, tone: 'gold' },
  { key: 'panel', icon: Gauge, tone: 'olive' },
  { key: 'session', icon: History, tone: 'steel' }
] as const;

export const MOD_FAIR_PLAY = {
  reads: ['results', 'dossier', 'feedback', 'queue', 'loadout'],
  never: ['enemies', 'reload', 'aim', 'allies', 'others']
} as const;

export const MOD_INSTALL_STEPS = ['download', 'install', 'launch', 'bind'] as const;

export const MOD_SWITCHES = [
  { id: 'battleResults', setting: 'send_battle_results' },
  { id: 'moeSnapshots', setting: 'send_moe_snapshots' },
  { id: 'queueTimes', setting: 'send_queue_times' },
  { id: 'loadouts', setting: 'send_loadouts' },
  { id: 'shots', setting: 'send_shots' },
  { id: 'moePanel', setting: 'battle_moe_panel' },
  { id: 'sessionPanel', setting: 'hangar_session_panel' },
  { id: 'shareSettings', setting: 'share_settings' }
] as const;

export const MOD_TUNABLES = [
  { id: 'flush', setting: 'flush_interval_seconds', value: 15 },
  { id: 'idle', setting: 'session_idle_minutes', value: 60 }
] as const;

export const MOD_FAQ = [
  { id: 'free' },
  { id: 'ban' },
  { id: 'bind', link: { href: ROUTES.account.overview, label: 'accountLink' } },
  { id: 'switches' },
  { id: 'replays', link: { href: ROUTES.replays.list, label: 'replaysLink' } },
  { id: 'delete', link: { href: ROUTES.account.overview, label: 'accountLink' } }
] as const satisfies readonly { id: string; link?: { href: string; label: 'accountLink' | 'replaysLink' } }[];
