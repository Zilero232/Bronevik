from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import AMMO_RACK, CREW_ROLES, STATE_CRITICAL, STATE_DESTROYED

# Fair play: only the own vehicle's state and the public kill feed every player sees; nothing about enemies'
# positions, reloads or aim.


def device_event(device, state):
    if not device or state not in (STATE_CRITICAL, STATE_DESTROYED):
        return None
    if device == AMMO_RACK:
        return 'ammo_rack'
    if device.rstrip('0123456789') in CREW_ROLES:
        return 'crew_injured' if state == STATE_DESTROYED else None
    return 'module_critical' if state == STATE_CRITICAL else 'module_destroyed'


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
        if killer_id and killer_id == self.own_vehicle_id and victim_id != self.own_vehicle_id:
            events.append('own_frag')
        if victim_id == self.own_vehicle_id:
            events.append('own_death')
        return events


class SoundPicker(object):

    def __init__(self, settings):
        self.settings = settings
        self.played = {}

    def pick(self, key, now):
        sound = self.settings.get(key)
        if not sound:
            return None
        last = self.played.get(key)
        if last is not None and now - last < self.settings.get('cooldown_s'):
            return None
        self.played[key] = now
        return sound
