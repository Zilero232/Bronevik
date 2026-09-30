from __future__ import absolute_import, division, print_function, unicode_literals

# Device names of the own vehicle as the client reports them (Avatar: VEHICLE_VIEW_STATE.DEVICES with
# (deviceName, 'critical' | 'destroyed' | 'repaired' | 'normal', actualState), RU 1.45).
AMMO_RACK = 'ammoBay'
CREW_ROLES = ('commander', 'driver', 'radioman', 'gunner', 'loader')
STATE_CRITICAL = 'critical'
STATE_DESTROYED = 'destroyed'
# The client's own Wwise events played again when `stock_alerts` is on and the event has no sound of its own (RU 1.45
# client source: gui/sound_notifications.xml `fire_started` -> vo_fire_started; the impact of an own shot that damaged a
# module, imp_main_critical_AP_PC_NPC). UNVERIFIED on Lesta 1.45: that playSound2D plays the impact event in 2D.
STOCK_ALERTS = {
    'fire': 'vo_fire_started',
    'own_crit': 'imp_main_critical_AP_PC_NPC',
}
