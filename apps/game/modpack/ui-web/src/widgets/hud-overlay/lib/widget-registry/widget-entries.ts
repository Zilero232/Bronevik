import { artyMeterSchema, ArtyMeterWidget } from '../../../../entities/hud-widgets/arty-meter';
import { battleClockSchema, BattleClockWidget } from '../../../../entities/hud-widgets/battle-clock';
import { battleLoadoutSchema, BattleLoadoutWidget } from '../../../../entities/hud-widgets/battle-loadout';
import { cardSchema, CardWidget } from '../../../../entities/hud-widgets/card';
import { consumablesSchema, ConsumablesWidget, reloadTimerSchema, ReloadTimerWidget } from '../../../../entities/hud-widgets/consumables';
import { damageLogSchema, DamageLogWidget, lastHitSchema, LastHitWidget } from '../../../../entities/hud-widgets/damage-log';
import { hitLogSchema, HitLogWidget } from '../../../../entities/hud-widgets/hit-log';
import { marksPanelSchema, MarksPanelWidget } from '../../../../entities/hud-widgets/marks-panel';
import { platoonPointsSchema, PlatoonPointsWidget } from '../../../../entities/hud-widgets/platoon-points';
import { sixthSenseSchema, SixthSenseWidget } from '../../../../entities/hud-widgets/sixth-sense';
import { teamHpSchema, TeamHpWidget } from '../../../../entities/hud-widgets/team-hp';
import { defineHudWidget } from '../../../../shared/lib/hud-widget';

export const WIDGET_ENTRIES = [
  defineHudWidget({ kind: 'team_hp', schema: teamHpSchema, Component: TeamHpWidget }),
  defineHudWidget({ kind: 'damage_log', schema: damageLogSchema, Component: DamageLogWidget }),
  defineHudWidget({ kind: 'last_hit', schema: lastHitSchema, Component: LastHitWidget }),
  defineHudWidget({ kind: 'hit_log', schema: hitLogSchema, Component: HitLogWidget }),
  defineHudWidget({ kind: 'marks_panel', schema: marksPanelSchema, Component: MarksPanelWidget }),
  defineHudWidget({ kind: 'consumables', schema: consumablesSchema, Component: ConsumablesWidget }),
  defineHudWidget({ kind: 'reload_timer', schema: reloadTimerSchema, Component: ReloadTimerWidget }),
  defineHudWidget({ kind: 'battle_loadout', schema: battleLoadoutSchema, Component: BattleLoadoutWidget, pointer: true }),
  defineHudWidget({ kind: 'sixth_sense', schema: sixthSenseSchema, Component: SixthSenseWidget }),
  defineHudWidget({ kind: 'battle_clock', schema: battleClockSchema, Component: BattleClockWidget }),
  defineHudWidget({ kind: 'arty_meter', schema: artyMeterSchema, Component: ArtyMeterWidget }),
  defineHudWidget({ kind: 'platoon_points', schema: platoonPointsSchema, Component: PlatoonPointsWidget }),
  defineHudWidget({ kind: 'card', schema: cardSchema, Component: CardWidget })
];
