import { Mark3Icon } from '@otmetki/icons';
import { Gauge, History, ScrollText } from 'lucide-react';

export const MOD_PAGE = {
  heroGlyph: 480,
  iconSize: 18,
  featureIconSize: 22
} as const;

export const MOD_FEATURES = [
  { key: 'results', icon: ScrollText },
  { key: 'marks', icon: Mark3Icon },
  { key: 'panel', icon: Gauge },
  { key: 'session', icon: History }
] as const;

export const MOD_FAIR_PLAY = {
  reads: ['results', 'dossier', 'feedback', 'queue', 'loadout'],
  never: ['enemies', 'reload', 'aim', 'allies', 'others']
} as const;

export const MOD_INSTALL_STEPS = ['download', 'copy', 'launch', 'bind'] as const;

export const MOD_SWITCHES = [
  { id: 'battleResults', setting: 'send_battle_results' },
  { id: 'moeSnapshots', setting: 'send_moe_snapshots' },
  { id: 'moeDistribution', setting: 'send_moe_distribution' },
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

export const MOD_FAQ = ['free', 'ban', 'bind', 'switches', 'replays', 'delete'] as const;
