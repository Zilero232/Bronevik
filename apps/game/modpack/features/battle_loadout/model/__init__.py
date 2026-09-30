from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, string_types, to_text
from ....core.format import COLOR_WARN, font
from ....core.hud.icons import artefact_icon, image, split
from .constants import (BONUS_MARK, ICON_FALLBACK, MAX_EFFECT, MAX_ITEMS, MAX_MODERNIZED_LEVEL, MAX_NAME, OVERLAY_DELUXE, OVERLAY_MODERNIZED,
                        OVERLAY_PATH, OVERLAY_TROPHIES)

# Fair play: the player's own tank only, the equipment its descriptor carries (what the stock equipment tooltips read).
# The client tells nothing about other vehicles' equipment and nothing is inferred.


def _text(value, limit):
    return to_text(value).strip()[:limit] if isinstance(value, string_types) and value.strip() else None


def overlay_of(raw):
    if raw.get('deluxe'):
        return image(OVERLAY_PATH % OVERLAY_DELUXE)
    level = raw.get('level')
    if raw.get('modernized') and is_int(level) and 1 <= level <= MAX_MODERNIZED_LEVEL:
        return image(OVERLAY_PATH % (OVERLAY_MODERNIZED % level))
    trophy = OVERLAY_TROPHIES.get(raw.get('trophy'))
    return image(OVERLAY_PATH % trophy) if trophy else None


def clean_device(raw):
    if not isinstance(raw, dict):
        return None
    name = _text(raw.get('name'), MAX_NAME)
    if name is None:
        return None
    return {'name': name, 'effect': _text(raw.get('effect'), MAX_EFFECT) or u'', 'icon': artefact_icon(raw.get('icon'), ICON_FALLBACK),
            'overlay': overlay_of(raw), 'bonus': bool(raw.get('bonus'))}


def clean_devices(raw):
    return [device for device in (clean_device(item) for item in (raw or [])[:MAX_ITEMS]) if device is not None]


def format_panel(devices, settings):
    size = settings.get('icon_size')
    parts = []
    for device in devices:
        path, _ = split(device['icon'])
        mark = font(BONUS_MARK, COLOR_WARN) if device['bonus'] else u''
        parts.append((u'<img src="img://%s" width="%d" height="%d"/>' % (path, size, size) if path else device['name']) + mark)
    return u' '.join(parts)
