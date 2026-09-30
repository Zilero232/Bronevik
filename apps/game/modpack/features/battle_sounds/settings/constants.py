from __future__ import absolute_import, division, print_function, unicode_literals

SWITCH = 'battle_sounds'
SECTION = 'battle_sounds'
GROUP = 'battle'

# One Wwise event per own-vehicle / kill-feed event; empty plays nothing extra (the vanilla sounds stay).
EVENTS = (
    'fire',
    'module_critical',
    'module_destroyed',
    'ammo_rack',
    'crew_injured',
    'first_blood',
    'own_frag',
    'own_death',
    'own_crit',
)

DEFAULTS = dict((event, '') for event in EVENTS)
DEFAULTS['cooldown_s'] = 2
# Off: the stock sounds (model/constants STOCK_ALERTS) are played once more for the events left empty, a louder cue
# without a sound mod.
DEFAULTS['stock_alerts'] = False

LIMITS = {'cooldown_s': (0, 30)}
