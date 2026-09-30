import type { UiIconName } from '../../../shared/lib/icon-sprite';
import type { SECTION } from './section.constants';

export const SECTION_ICONS: Record<(typeof SECTION)[keyof typeof SECTION], UiIconName> = {
  battle: 'swords',
  hangar: 'warehouse',
  marks: 'award',
  replays: 'clapperboard',
  streamer: 'radio',
  data: 'globe',
  profiles: 'layers',
  hud: 'layout-dashboard'
};

export const COMPONENT_ICONS: Partial<Record<string, UiIconName>> = {
  companion: 'link',
  marks_panel: 'gauge',
  damage_log: 'scroll-text',
  last_hit: 'zap',
  hit_log: 'target',
  team_hp: 'heart-pulse',
  sixth_sense: 'lightbulb',
  battle_clock: 'timer',
  personal_best: 'trophy',
  main_gun: 'badge-check',
  battle_efficiency: 'activity',
  reload_timer: 'hourglass',
  gun_arc: 'move-horizontal',
  received_hits: 'shield-alert',
  death_card: 'skull',
  bush_circle: 'trees',
  arty_meter: 'bomb',
  platoon_points: 'users',
  battle_loadout: 'wrench',
  minimap: 'map',
  crosshair: 'crosshair',
  camera: 'video',
  battle_sounds: 'volume-2',
  chat_filter: 'message-square-off',
  streamer_mode: 'eye-off',
  hangar_cleaner: 'eraser',
  session_stats: 'chart-column',
  battle_results: 'clipboard-list',
  marks_history: 'chart-line',
  hangar_ratings: 'star',
  hangar_marks: 'medal',
  session_goals: 'goal',
  tilt_guard: 'coffee',
  hangar_tweaks: 'sliders-horizontal',
  hangar_info: 'info',
  battle_hits: 'shield',
  personal_missions: 'list-checks',
  platoon_helper: 'users-round',
  auto_resupply: 'refresh-cw',
  notification_filter: 'bell-off',
  replay_manager: 'film',
  replay_upload: 'cloud-upload'
};

export const FALLBACK_COMPONENT_ICON: UiIconName = 'puzzle';
