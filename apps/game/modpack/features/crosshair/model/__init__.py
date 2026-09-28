from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import NATIVE, tri_state
from .constants import CENTRE_PART, MARK_FILES, MARK_RENDITIONS, MARK_ROOT, MODE_RETICLES, PRESET_PARTS, SERVER_RETICLE

# Visual only: a preset sets the opacity and style of reticle parts the game's settings already offer, and a centre
# mark is a static image drawn where the client already draws its own reticle centre. Nothing here computes anything
# (no lead, no penetration, no aim assist, no enemy data). The vanilla reticle art (Scaleform crosshairPanel,
# battleAtlas) is never replaced (README "Crosshair").


def to_native(values):
    result = {}
    preset = values.get('preset')
    reticles = MODE_RETICLES.get(values.get('modes'), ())
    if preset != NATIVE and preset in PRESET_PARTS:
        for reticle in reticles:
            result[reticle] = dict(PRESET_PARTS[preset])
    if mark_image(values.get('mark'), values.get('mark_size')) and values.get('mark_hides_centre'):
        for reticle in reticles:
            result.setdefault(reticle, {})[CENTRE_PART] = 0
    server = tri_state(values.get('server_reticle'))
    if server is not None:
        result[SERVER_RETICLE] = server
    return result


def rendition(size):
    for candidate in MARK_RENDITIONS:
        if size <= candidate:
            return candidate
    return MARK_RENDITIONS[-1]


def mark_image(mark, size):
    """The client path of the mark's image in the smallest rendition not below `size`, or None."""
    found = MARK_FILES.get(mark)
    if found is None or not size:
        return None
    folder, stem = found
    return '%s/%s/%s_%d.png' % (MARK_ROOT, folder, stem, rendition(size))


def mark_html(mark, size):
    path = mark_image(mark, size)
    return '<img src="img://%s" width="%d" height="%d"/>' % (path, size, size) if path else ''


def screen_centre(size, scale):
    width, height = size
    factor = scale if scale > 1.0 else 1.0
    return int(0.5 * width / factor), int(0.5 * height / factor)


def mark_offset(position, size, scale, settings):
    """The mark's x/y relative to the screen centre (the panel is centre-aligned): the reticle's scaled position
    (CrosshairDataProxy.getScaledPosition) minus the centre, plus the player's own offset."""
    centre_x, centre_y = screen_centre(size, scale)
    return position[0] - centre_x + settings.get('x'), position[1] - centre_y + settings.get('y')


def shows_in(modes, arcade, sniper):
    reticles = MODE_RETICLES.get(modes, ())
    return (arcade and 'arcade' in reticles) or (sniper and 'sniper' in reticles)
