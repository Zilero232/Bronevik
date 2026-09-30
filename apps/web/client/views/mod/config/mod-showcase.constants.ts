import { CrosshairIcon, EquipStandardIcon, Mark3Icon, OnslaughtIcon, RadioIcon } from '@otmetki/icons';
import {
  BellOff,
  Bomb,
  CalendarClock,
  ChartColumn,
  CircleDashed,
  Clock,
  CloudUpload,
  Coffee,
  EyeOff,
  Film,
  Flag,
  Gauge,
  HeartPulse,
  History,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  MapIcon,
  Medal,
  MessageSquareOff,
  MoveHorizontal,
  Percent,
  RefreshCw,
  ScrollText,
  Server,
  Shield,
  ShieldAlert,
  Sigma,
  Skull,
  SlidersHorizontal,
  Sparkles,
  Swords,
  Target,
  TimerReset,
  Trophy,
  Users,
  UsersRound,
  Volume2,
  Warehouse,
  ZoomIn
} from 'lucide-react';

export const MOD_SHOWCASE = [
  {
    id: 'battle',
    icon: Swords,
    items: [
      { id: 'damage_log', icon: Swords, context: 'battle', isDefault: true },
      { id: 'hit_log', icon: Target, context: 'battle', isDefault: true },
      { id: 'received_hits', icon: ShieldAlert, context: 'battle', isDefault: false },
      { id: 'team_hp', icon: HeartPulse, context: 'battle', isDefault: true },
      { id: 'sixth_sense', icon: Lightbulb, context: 'battle', isDefault: true },
      { id: 'reload_timer', icon: TimerReset, context: 'battle', isDefault: true },
      { id: 'battle_loadout', icon: EquipStandardIcon, context: 'battle', isDefault: true },
      { id: 'gun_arc', icon: MoveHorizontal, context: 'battle', isDefault: false },
      { id: 'death_card', icon: Skull, context: 'battle', isDefault: true },
      { id: 'bush_circle', icon: CircleDashed, context: 'battle', isDefault: true },
      { id: 'arty_meter', icon: Bomb, context: 'any', isDefault: false },
      { id: 'platoon_points', icon: Users, context: 'battle', isDefault: false },
      { id: 'crosshair', icon: CrosshairIcon, context: 'battle', isDefault: true },
      { id: 'camera', icon: ZoomIn, context: 'battle', isDefault: true },
      { id: 'minimap', icon: MapIcon, context: 'battle', isDefault: true },
      { id: 'hud_layouts', icon: LayoutDashboard, context: 'battle', isDefault: true },
      { id: 'chat_filter', icon: MessageSquareOff, context: 'battle', isDefault: true },
      { id: 'battle_sounds', icon: Volume2, context: 'battle', isDefault: false }
    ]
  },
  {
    id: 'hangar',
    icon: Warehouse,
    items: [
      { id: 'hangar_tweaks', icon: SlidersHorizontal, context: 'hangar', isDefault: true },
      { id: 'hangar_info', icon: Server, context: 'hangar', isDefault: true },
      { id: 'hangar_cleaner', icon: Sparkles, context: 'hangar', isDefault: true },
      { id: 'notification_filter', icon: BellOff, context: 'hangar', isDefault: true },
      { id: 'auto_resupply', icon: RefreshCw, context: 'hangar', isDefault: true },
      { id: 'battle_hits', icon: Shield, context: 'hangar', isDefault: true },
      { id: 'personal_missions', icon: ListChecks, context: 'any', isDefault: true },
      { id: 'platoon_helper', icon: UsersRound, context: 'hangar', isDefault: true },
      { id: 'comp7_helper', icon: OnslaughtIcon, context: 'hangar', isDefault: true },
      { id: 'event_trackers', icon: CalendarClock, context: 'hangar', isDefault: false },
      { id: 'tilt_guard', icon: Coffee, context: 'hangar', isDefault: true }
    ]
  },
  {
    id: 'marks',
    icon: Mark3Icon,
    items: [
      { id: 'marks_panel', icon: Mark3Icon, context: 'battle', isDefault: true },
      { id: 'hangar_marks', icon: Percent, context: 'hangar', isDefault: true },
      { id: 'marks_history', icon: History, context: 'hangar', isDefault: true },
      { id: 'hangar_ratings', icon: Sigma, context: 'hangar', isDefault: true },
      { id: 'session_stats', icon: ChartColumn, context: 'hangar', isDefault: true },
      { id: 'battle_results', icon: ScrollText, context: 'hangar', isDefault: true },
      { id: 'battle_efficiency', icon: Gauge, context: 'battle', isDefault: false },
      { id: 'main_gun', icon: Medal, context: 'battle', isDefault: false },
      { id: 'session_goals', icon: Flag, context: 'any', isDefault: true }
    ]
  },
  {
    id: 'replays',
    icon: Film,
    items: [
      { id: 'replay_manager', icon: Film, context: 'hangar', isDefault: true },
      { id: 'replay_upload', icon: CloudUpload, context: 'hangar', isDefault: false }
    ]
  },
  {
    id: 'streamers',
    icon: RadioIcon,
    items: [
      { id: 'streamer_mode', icon: EyeOff, context: 'any', isDefault: false },
      { id: 'battle_clock', icon: Clock, context: 'any', isDefault: false },
      { id: 'personal_best', icon: Trophy, context: 'any', isDefault: false }
    ]
  }
] as const;

export const MOD_SHOWCASE_BASE = ['core', 'companion', 'ui'] as const;

export const MOD_SHOWCASE_CONTEXT_TONE = {
  battle: 'battle',
  hangar: 'olive',
  any: 'steel'
} as const;
