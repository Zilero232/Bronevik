"""Crosshair presets over the client's own reticle settings, plus the client's server-reticle switch.

Visual only: a preset sets the opacity and style of reticle parts the game's settings already offer.
Nothing here computes anything (no lead, no penetration, no aim assist, no enemy data). Custom reticle
art would mean shipping replacement Scaleform assets; see README "Crosshair" for that pipeline."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import NATIVE, tri_state
from .constants import MODE_RETICLES, PRESET_PARTS, SERVER_RETICLE


def to_native(values):
    result = {}
    preset = values.get('preset')
    if preset != NATIVE and preset in PRESET_PARTS:
        for reticle in MODE_RETICLES.get(values.get('modes'), ()):
            result[reticle] = dict(PRESET_PARTS[preset])
    server = tri_state(values.get('server_reticle'))
    if server is not None:
        result[SERVER_RETICLE] = server
    return result
