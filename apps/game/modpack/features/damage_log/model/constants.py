from __future__ import absolute_import, division, print_function, unicode_literals

KINDS = ('damage', 'radio', 'track', 'stun', 'blocked', 'received')
MAX_ENTRIES = 50

LOG_KIND_FILTER = {
    'all': KINDS,
    'dealt': ('damage', 'radio', 'track', 'stun', 'blocked'),
    'received': ('received',),
}

# Where received damage came from, as the own feedback event's extra tells it (feedback_events._DamageExtra, RU 1.45:
# isShot / isFire / isRam / isWorldCollision / isDeathZone); anything else (artillery strikes, mines, ...) is `other`.
SOURCES = ('shot', 'fire', 'ram', 'world', 'other')
# The own ammo rack reported damaged (the damage panel's DEVICES state 'ammoBay') within this many seconds of a
# received hit marks that hit as the one that reached the ammo rack.
AMMO_RACK_WINDOW_S = 1.5

# Vehicle class tags of the arena data (arena_vos, RU 1.45) -> our glyph names.
CLASS_GLYPHS = {
    'lightTank': 'class_light',
    'mediumTank': 'class_medium',
    'heavyTank': 'class_heavy',
    'AT-SPG': 'class_td',
    'SPG': 'class_spg',
}

PREVIEW_ENTRIES = (
    ('damage', 390, 'Pz. IV', 'ap', None, 'mediumTank'),
    ('radio', 480, None, None, None, None),
    ('damage', 320, 'T-34', 'apcr', None, 'mediumTank'),
    ('blocked', 240, 'IS', 'heat', None, 'heavyTank'),
    ('received', 310, 'KV-1', 'he', 'shot', 'heavyTank'),
)
PREVIEW_SIZE = (300, 130)
PREVIEW_SHELLS = {'ap': ('ARMOR_PIERCING', False), 'apcr': ('ARMOR_PIERCING_CR', True), 'heat': ('HOLLOW_CHARGE', False),
                  'he': ('HE_MODERN', False)}
PREVIEW_LAST_HIT = ('received', 310, 'KV-1', 'he', 'shot', 'heavyTank')
PREVIEW_LAST_HIT_SIZE = (260, 30)

# Totals colours per palette: (dealt, blocked, assisted, received). graphite is @otmetki/design-tokens (accent,
# steel, gold, danger); colorblind is the Okabe-Ito set.
PALETTES = {
    'classic': ('#E3564A', '#9EC9F5', '#7CD35B', '#F2B25B'),
    'graphite': ('#FF7A1A', '#8EA4B5', '#E8B84A', '#EF5B43'),
    'contrast': ('#FF4040', '#40C0FF', '#80FF40', '#FFD23F'),
    'colorblind': ('#E69F00', '#56B4E9', '#009E73', '#CC79A7'),
}
COLOR_MACROS = ('c_dealt', 'c_blocked', 'c_assisted', 'c_received')
# Entry colours: each kind takes its totals colour (or the player's own colour key when set).
KIND_COLOR = {
    'damage': ('c_dealt', 'color_damage'),
    'radio': ('c_assisted', 'color_assist'),
    'track': ('c_assisted', 'color_assist'),
    'stun': ('c_assisted', 'color_assist'),
    'blocked': ('c_blocked', 'color_blocked'),
    'received': ('c_received', 'color_received'),
}
# The kind glyphs the package ships (assets/assets.json: otmetki_damage_log_icons).
ICON_ROOT = 'gui/maps/icons/otmetki/damage_log/icons'
ICON_RENDITION = 32

KIND = 'damage_log'
LAST_HIT_KIND = 'last_hit'
# Totals of the widget: (key, efficiency icon or our glyph, colour role, shown when zero).
TOTALS = (
    ('dealt', 'damage', 'accent', True),
    ('blocked', 'armor', 'blocked', True),
    ('assisted', 'help', 'radio', True),
    ('assist_stun', 'stun', 'stun', False),
    ('received', None, 'received', False),
)
KIND_TONES = {'damage': 'accent', 'radio': 'radio', 'track': 'track', 'stun': 'stun', 'blocked': 'blocked', 'received': 'received'}
KIND_GLYPHS = {'radio': 'radio', 'track': 'track', 'stun': 'stun', 'blocked': 'blocked', 'damage': 'damage', 'received': 'received'}
SOURCE_ICONS = {'fire': ('efficiency', 'fire'), 'ram': ('efficiency', 'ram'), 'world': ('glyph', 'fall')}
COMPACT_STYLES = ('compact', 'minimal')
