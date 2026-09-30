from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.native_settings import NATIVE, tri_state
from .constants import (
    ARCADE,
    CENTRE_PART,
    DEFAULT_MARK_COLOR,
    MARK_COLORS,
    MARK_FILES,
    MARK_RENDITIONS,
    MARK_ROOT,
    MODE_RETICLES,
    PRESET_PARTS,
    SERVER_RETICLE,
    SNIPER,
    TINTED_FOLDER,
)

# Visual only: a preset sets the opacity and style of reticle parts the game's settings already offer, and a centre
# mark is a static image drawn where the client already draws its own reticle centre. Nothing here computes anything
# (no lead, no penetration, no aim assist, no enemy data). The vanilla reticle art (Scaleform crosshairPanel,
# battleAtlas) is never replaced (README "Crosshair").


def to_native(values):
    result = {}
    reticles = MODE_RETICLES.get(values.get('modes'), ())

    preset = values.get('preset')
    if preset != NATIVE and preset in PRESET_PARTS:
        for reticle in reticles:
            result[reticle] = dict(PRESET_PARTS[preset])

    has_mark = mark_image(values.get('mark'), values.get('mark_size')) is not None
    if has_mark and values.get('mark_hides_centre'):
        for reticle in reticles:
            result.setdefault(reticle, {})[CENTRE_PART] = 0

    server_reticle = tri_state(values.get('server_reticle'))
    if server_reticle is not None:
        result[SERVER_RETICLE] = server_reticle
    return result


def rendition(size):
    for candidate in MARK_RENDITIONS:
        if size <= candidate:
            return candidate
    return MARK_RENDITIONS[-1]


def mark_image(mark, size, color=DEFAULT_MARK_COLOR):
    found = MARK_FILES.get(mark)
    if found is None or not size:
        return None

    folder, stem = found
    if folder == TINTED_FOLDER:
        if color not in MARK_COLORS:
            color = DEFAULT_MARK_COLOR
        stem = '%s_%s' % (stem, color)
    return '%s/%s/%s_%d.png' % (MARK_ROOT, folder, stem, rendition(size))


def mark_html(mark, size, color=DEFAULT_MARK_COLOR):
    path = mark_image(mark, size, color)
    if path is None:
        return ''
    return '<img src="img://%s" width="%d" height="%d"/>' % (path, size, size)


def screen_centre(size, scale):
    width, height = size
    factor = max(scale, 1.0)
    return int(0.5 * width / factor), int(0.5 * height / factor)


# The panel is centre-aligned, so the mark's x/y is the reticle's scaled position (CrosshairDataProxy
# .getScaledPosition) relative to the screen centre, plus the player's own offset.
def mark_offset(position, size, scale, settings):
    centre_x, centre_y = screen_centre(size, scale)
    reticle_x, reticle_y = position
    return reticle_x - centre_x + settings.get('x'), reticle_y - centre_y + settings.get('y')


def shows_in(modes, is_arcade, is_sniper):
    reticles = MODE_RETICLES.get(modes, ())
    if is_arcade and ARCADE in reticles:
        return True
    return is_sniper and SNIPER in reticles
