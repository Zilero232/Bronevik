from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import NATIVE, TRI_STATE
from ..model.constants import MARK_COLORS

SWITCH = 'crosshair_presets'
GROUP = 'battle'
PANEL_ID = 'crosshair'

PRESETS = (NATIVE, 'classic', 'minimal', 'contrast', 'clean')
MODES = ('both', 'arcade', 'sniper')
# Centre marks drawn over the game's own reticle centre: our originals, our one-colour marks (in MARK_COLORS), then
# five of Kenney's CC0 pack.
MARKS = (
    'none',
    'dot',
    'cross',
    'ring',
    'chevron',
    'streamer',
    'colorblind',
    'triad',
    'arcs',
    'aim_box',
    'stack',
    'tint_dot',
    'tint_cross',
    'tint_ring',
    'tint_brackets',
    'tint_diamond',
    'kenney_dotted',
    'kenney_cluster',
    'kenney_pincer',
    'kenney_arrows',
    'kenney_scope',
)

# x/y are the mark's offset from the reticle centre, not a screen position: the mark follows the reticle,
# so it is not dragged (a drag would save a screen position).
DEFAULTS = {
    'preset': NATIVE,
    'modes': 'both',
    'server_reticle': NATIVE,
    'mark': 'none',
    'mark_size': 48,
    'mark_color': 'white',
    'mark_hides_centre': True,
    'x': 0,
    'y': 0,
    'align_x': 'center',
    'align_y': 'center',
    'drag': False,
}

CHOICES = {
    'preset': PRESETS,
    'modes': MODES,
    'server_reticle': TRI_STATE,
    'mark': MARKS,
    'mark_color': MARK_COLORS,
}

LIMITS = {'mark_size': (16, 128), 'x': (-200, 200), 'y': (-200, 200)}
