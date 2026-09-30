import { defineHudWidget } from '../../../../../shared/lib/hud-widget';
import { artyMeterSchema, ArtyMeterWidget } from '../../../arty-meter';
import { battleClockSchema, BattleClockWidget } from '../../../battle-clock';
import { battleLoadoutSchema, BattleLoadoutWidget } from '../../../battle-loadout';
import { cardSchema, CardWidget } from '../../../card';
import { consumablesSchema, ConsumablesWidget, reloadTimerSchema, ReloadTimerWidget } from '../../../consumables';
import { crosshairSchema, CrosshairWidget } from '../../../crosshair';
import { damageLogSchema, DamageLogWidget, lastHitSchema, LastHitWidget } from '../../../damage-log';
import { hitLogSchema, HitLogWidget } from '../../../hit-log';
import { marksPanelSchema, MarksPanelWidget } from '../../../marks-panel';
import { platoonPointsSchema, PlatoonPointsWidget } from '../../../platoon-points';
import { sixthSenseSchema, SixthSenseWidget } from '../../../sixth-sense';
import { teamHpSchema, TeamHpWidget } from '../../../team-hp';

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
  defineHudWidget({ kind: 'crosshair', schema: crosshairSchema, Component: CrosshairWidget }),
  defineHudWidget({ kind: 'card', schema: cardSchema, Component: CardWidget })
];
