from __future__ import absolute_import, division, print_function, unicode_literals

# Client setting names (settings_constants.AIM / GAME in the WoT-era client), UNVERIFIED on Lesta 1.45.
# Each reticle is a dict of the parts the game's own "Reticle" settings tab shows: an opacity (0-100) or a
# style index per part. A preset only sets those parts; the rest of the dict is kept as the player had it.
ARCADE = 'arcade'
SNIPER = 'sniper'
SERVER_RETICLE = 'useServerAim'

RETICLE_PARTS = ('net', 'netType', 'centralTag', 'centralTagType', 'mixing', 'mixingType', 'gunTag', 'gunTagType', 'reloader',
                 'reloaderTimer', 'condition', 'cassette', 'zoomIndicator')
OPACITY_PARTS = ('net', 'centralTag', 'mixing', 'gunTag', 'reloader', 'reloaderTimer', 'condition', 'cassette', 'zoomIndicator')
STYLE_PARTS = ('netType', 'centralTagType', 'mixingType', 'gunTagType')
STYLE_MAX = 15

PRESET_PARTS = {
    'classic': {'net': 100, 'netType': 0, 'centralTag': 100, 'centralTagType': 0, 'mixing': 100, 'mixingType': 0, 'gunTag': 100,
                'gunTagType': 0, 'reloader': 100, 'reloaderTimer': 100, 'condition': 100, 'cassette': 100, 'zoomIndicator': 100},
    'minimal': {'net': 0, 'centralTag': 100, 'centralTagType': 0, 'mixing': 60, 'gunTag': 100, 'reloader': 60, 'reloaderTimer': 100,
                'condition': 0, 'cassette': 100, 'zoomIndicator': 0},
    'contrast': {'net': 100, 'netType': 1, 'centralTag': 100, 'centralTagType': 4, 'mixing': 100, 'mixingType': 2, 'gunTag': 100,
                 'gunTagType': 3, 'reloader': 100, 'reloaderTimer': 100, 'condition': 100, 'cassette': 100, 'zoomIndicator': 100},
    'clean': {'net': 0, 'centralTag': 0, 'mixing': 100, 'gunTag': 100, 'reloader': 100, 'reloaderTimer': 100, 'condition': 0,
              'cassette': 100, 'zoomIndicator': 0},
}

MODE_RETICLES = {
    'both': (ARCADE, SNIPER),
    'arcade': (ARCADE,),
    'sniper': (SNIPER,),
}

# The mark images the package ships (assets/assets.json: otmetki_crosshair, kenney_crosshair_pack), as the client
# reads them through Scaleform `img://`. Each is rendered at every size of MARK_RENDITIONS.
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
    'kenney_dotted': ('kenney', 'crosshair-016'),
    'kenney_cluster': ('kenney', 'crosshair-021'),
    'kenney_pincer': ('kenney', 'crosshair-061'),
    'kenney_arrows': ('kenney', 'crosshair-113'),
    'kenney_scope': ('kenney', 'crosshair-196'),
}
CENTRE_PART = 'centralTag'
PREVIEW_SIZE = (128, 128)
