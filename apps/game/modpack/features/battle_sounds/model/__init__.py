from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import AMMO_RACK, CREW_ROLES, STATE_CRITICAL, STATE_DESTROYED, STOCK_ALERTS

# Fair play: only the own vehicle's state, the player's own feedback (a module the own shot damaged) and the public
# kill feed every player sees; nothing about enemies' positions, reloads or aim.


def device_event(device, state):
    if not device or state not in (STATE_CRITICAL, STATE_DESTROYED):
        return None
    if device == AMMO_RACK:
        return 'ammo_rack'
    if device.rstrip('0123456789') in CREW_ROLES:
        if state == STATE_DESTROYED:
            return 'crew_injured'
        return None
    if state == STATE_CRITICAL:
        return 'module_critical'
    return 'module_destroyed'


def device_change(value):
    if isinstance(value, (tuple, list)) and len(value) >= 2:
        return value[0], value[1]
    return None, None


class KillFeed(object):

    def __init__(self, own_vehicle_id):
        self.own_vehicle_id = own_vehicle_id
        self.kills = 0

    def killed(self, victim_id, killer_id):
        self.kills += 1
        events = []
        if self.kills == 1:
            events.append('first_blood')
        is_own_death = victim_id == self.own_vehicle_id
        is_own_kill = bool(killer_id) and killer_id == self.own_vehicle_id
        if is_own_kill and not is_own_death:
            events.append('own_frag')
        if is_own_death:
            events.append('own_death')
        return events


class SoundPicker(object):

    def __init__(self, settings):
        self.settings = settings
        self.played = {}

    def sound_of(self, key):
        sound = self.settings.get(key)
        if sound:
            return sound
        if self.settings.get('stock_alerts'):
            return STOCK_ALERTS.get(key)
        return None

    def pick(self, key, now):
        sound = self.sound_of(key)
        if not sound:
            return None
        last = self.played.get(key)
        if last is not None and now - last < self.settings.get('cooldown_s'):
            return None
        self.played[key] = now
        return sound
