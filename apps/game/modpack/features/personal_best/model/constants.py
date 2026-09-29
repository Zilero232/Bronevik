from __future__ import absolute_import, division, print_function, unicode_literals

METRICS = ('damage', 'assist', 'frags', 'xp')
# XP is known only from the battle results, so the battle line shows the other three.
LIVE_METRICS = ('damage', 'assist', 'frags')
# The dossier's maxAssisted is track + radio + stun assist (dossiers2/custom/battle_results_processors.py:437, RU 1.45).
KIND_BY_EVENT = (
    ('DAMAGE', 'damage'),
    ('RADIO_ASSIST', 'assist'),
    ('TRACK_ASSIST', 'assist'),
    ('STUN_ASSIST', 'assist'),
    ('KILL', 'frags'),
)
ASSIST_STATS = ('damage_assisted_radio', 'damage_assisted_track', 'damage_assisted_stun')
# The fallback when the client's bonus caps cannot be read: the random battle, the main type the dossier's max15x15 counts.
RANDOM_BONUS_TYPE = 1
STORE_FILE = 'personal_best_%d.json'
MAX_TANKS = 500
SOUND = 'otmetki_record'

PREVIEW_SIZE = (320, 50)
PREVIEW_RECORD = {'damage': 6812, 'assist': 5120, 'frags': 6, 'xp': 2740}
PREVIEW_LIVE = {'damage': 5612, 'assist': 840, 'frags': 2}
