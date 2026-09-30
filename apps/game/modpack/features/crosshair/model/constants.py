from __future__ import absolute_import, division, print_function, unicode_literals

# Client setting names, RU 1.45 client source (settings_constants.AIM.ARCADE / SNIPER, GAME.ENABLE_SERVER_AIM;
# SettingsCore options.AimSetting).
# Each reticle is a dict of the parts the game's own "Reticle" settings tab shows: an opacity (0-100) or a
# style index per part. A preset only sets those parts; the rest of the dict is kept as the player had it.
ARCADE = 'arcade'
SNIPER = 'sniper'
SERVER_RETICLE = 'useServerAim'

PRESET_PARTS = {
    'classic': {
        'net': 100,
        'netType': 0,
        'centralTag': 100,
        'centralTagType': 0,
        'mixing': 100,
        'mixingType': 0,
        'gunTag': 100,
        'gunTagType': 0,
        'reloader': 100,
        'reloaderTimer': 100,
        'condition': 100,
        'cassette': 100,
        'zoomIndicator': 100,
    },
    'minimal': {
        'net': 0,
        'centralTag': 100,
        'centralTagType': 0,
        'mixing': 60,
        'gunTag': 100,
        'reloader': 60,
        'reloaderTimer': 100,
        'condition': 0,
        'cassette': 100,
        'zoomIndicator': 0,
    },
    'contrast': {
        'net': 100,
        'netType': 1,
        'centralTag': 100,
        'centralTagType': 4,
        'mixing': 100,
        'mixingType': 2,
        'gunTag': 100,
        'gunTagType': 3,
        'reloader': 100,
        'reloaderTimer': 100,
        'condition': 100,
        'cassette': 100,
        'zoomIndicator': 100,
    },
    'clean': {
        'net': 0,
        'centralTag': 0,
        'mixing': 100,
        'gunTag': 100,
        'reloader': 100,
        'reloaderTimer': 100,
        'condition': 0,
        'cassette': 100,
        'zoomIndicator': 0,
    },
}

MODE_RETICLES = {
    'both': (ARCADE, SNIPER),
    'arcade': (ARCADE,),
    'sniper': (SNIPER,),
}

# The mark images the package ships (assets/assets.json: otmetki_crosshair, otmetki_crosshair_tinted,
# kenney_crosshair_pack), as the client reads them through Scaleform `img://`. Each is rendered at every size of
# MARK_RENDITIONS; a TINTED_FOLDER mark also in every colour of MARK_COLORS (`<stem>_<colour>_<size>.png`).
TINTED_FOLDER = 'tinted'
MARK_COLORS = ('white', 'green', 'yellow', 'cyan', 'magenta', 'red')
DEFAULT_MARK_COLOR = 'white'
MARK_ROOT = 'gui/maps/icons/otmetki/crosshair'
MARK_RENDITIONS = (64, 128)
MARK_FILES = {
    'dot': ('otmetki', 'dot'),
    'cross': ('otmetki', 'cross'),
    'ring': ('otmetki', 'ring'),
    'chevron': ('otmetki', 'chevron'),
    'streamer': ('otmetki', 'streamer'),
    'colorblind': ('otmetki', 'colorblind'),
    'triad': ('otmetki', 'triad'),
    'arcs': ('otmetki', 'arcs'),
    'aim_box': ('otmetki', 'aim_box'),
    'stack': ('otmetki', 'stack'),
    'tint_dot': ('tinted', 'tint_dot'),
    'tint_cross': ('tinted', 'tint_cross'),
    'tint_ring': ('tinted', 'tint_ring'),
    'tint_brackets': ('tinted', 'tint_brackets'),
    'tint_diamond': ('tinted', 'tint_diamond'),
    'kenney_dotted': ('kenney', 'crosshair-016'),
    'kenney_cluster': ('kenney', 'crosshair-021'),
    'kenney_pincer': ('kenney', 'crosshair-061'),
    'kenney_arrows': ('kenney', 'crosshair-113'),
    'kenney_scope': ('kenney', 'crosshair-196'),
}
CENTRE_PART = 'centralTag'
PREVIEW_SIZE = (128, 128)
# The preview widget: a sketch of the game's own reticle with the chosen centre mark over it (ui-web crosshair).
KIND = 'crosshair'
# The settings window's crosshair editor (ui-web component-card editor): its control groups in order, the size of the
# gallery thumbnails (the 64 px rendition) and the colour each tinted rendition is recoloured to (assets.json).
EDITOR_GROUPS = (
    ('shape', ('mark',)),
    ('colour', ('mark_color',)),
    ('size', ('mark_size', 'mark_hides_centre')),
    ('reticle', ('preset', 'modes', 'server_reticle')),
)
EDITOR_GALLERY_KEY = 'mark'
EDITOR_SWATCH_KEY = 'mark_color'
THUMB_SIZE = 64
MARK_SWATCHES = {
    'white': '#f2f2f3',
    'green': '#7cd35b',
    'yellow': '#ffd23f',
    'cyan': '#40c8ff',
    'magenta': '#ff3df2',
    'red': '#ff4a3d',
}
