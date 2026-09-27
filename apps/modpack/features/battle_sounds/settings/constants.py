from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_sounds'
SECTION = 'battle_sounds'
GROUP = 'battle'

# One Wwise event per own-vehicle / kill-feed event; empty plays nothing extra (the vanilla sounds stay).
EVENTS = ('fire', 'module_critical', 'module_destroyed', 'ammo_rack', 'crew_injured', 'first_blood', 'own_frag', 'own_death')

DEFAULTS = dict((event, '') for event in EVENTS)
DEFAULTS['cooldown_s'] = 2

LIMITS = {'cooldown_s': (0, 30)}
