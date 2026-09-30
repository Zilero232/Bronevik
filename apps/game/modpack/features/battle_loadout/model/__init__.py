from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_int, string_types, to_text
from ....core.format import COLOR_WARN, font
from ....core.hud.icons import artefact_icon, image, split
from .constants import (ATTENTION_MARK, BONUS_MARK, BOOSTER_OVERLAY_PATH, BOOSTER_OVERLAYS, FLAGS, ICON_FALLBACK,
                        MAX_EFFECT, MAX_ITEMS, MAX_MODERNIZED_LEVEL, MAX_NAME, MAX_SETS, OVERLAY_DELUXE,
                        OVERLAY_MODERNIZED, OVERLAY_PATH, OVERLAY_TROPHIES, SET_GROUPS, SET_KEYS)

# Fair play: the player's own tank only, the equipment and directives its setups carry (what the stock equipment
# tooltips and ammunition panels read) and the device states the client reports for the own vehicle. The client tells
# nothing about other vehicles' equipment and nothing is inferred.


def _text(value, limit):
    if not isinstance(value, string_types) or not value.strip():
        return None
    return to_text(value).strip()[:limit]


def _device_overlay(raw):
    if raw.get('deluxe'):
        return image(OVERLAY_PATH % OVERLAY_DELUXE)

    level = raw.get('level')
    is_modernized = raw.get('modernized') and is_int(level) and 1 <= level <= MAX_MODERNIZED_LEVEL
    if is_modernized:
        return image(OVERLAY_PATH % (OVERLAY_MODERNIZED % level))

    trophy = OVERLAY_TROPHIES.get(raw.get('trophy'))
    return image(OVERLAY_PATH % trophy) if trophy else None


def overlay_of(raw):
    booster = BOOSTER_OVERLAYS.get(raw.get('booster'))
    if booster:
        return image(BOOSTER_OVERLAY_PATH % booster)
    return _device_overlay(raw)


def clean_device(raw):
    if not isinstance(raw, dict):
        return None

    name = _text(raw.get('name'), MAX_NAME)
    if name is None:
        return None

    device = {
        'name': name,
        'effect': _text(raw.get('effect'), MAX_EFFECT) or u'',
        'icon': artefact_icon(raw.get('icon'), ICON_FALLBACK),
        'overlay': overlay_of(raw),
    }
    device.update((flag, bool(raw.get(flag))) for flag in FLAGS)
    return device


def clean_devices(raw):
    cleaned = (clean_device(item) for item in (raw or [])[:MAX_ITEMS])
    return [device for device in cleaned if device is not None]


def _set_position(entry):
    if not isinstance(entry, dict):
        return None

    index = entry.get('index')
    total = entry.get('total')
    if not is_int(index) or not is_int(total):
        return None
    return (index, total) if 1 < total <= MAX_SETS and 0 <= index < total else None


# The client's layout indexes are 0-based (RU 1.45 gui/shared/gui_items/vehicle_equipment.py getLayoutIndex); the badge
# counts from 1, the way the prebattle setup selector numbers the sets.
def set_badges(raw, translate):
    badges = []
    for group in SET_GROUPS:
        position = _set_position((raw or {}).get(group))
        if position is None:
            continue
        index, total = position
        badges.append({'group': group, 'text': translate(SET_KEYS[group], index=index + 1, total=total)})
    return badges


def _mark(device):
    if device['attention']:
        return font(ATTENTION_MARK, COLOR_WARN)
    return font(BONUS_MARK, COLOR_WARN) if device['bonus'] else u''


def _icon_markup(device, size):
    path, _ = split(device['icon'])
    if not path:
        return device['name']
    return u'<img src="img://%s" width="%d" height="%d"/>' % (path, size, size)


def format_panel(devices, badges, settings):
    size = settings.get('icon_size')
    parts = [badge['text'] for badge in badges]
    parts.extend(_icon_markup(device, size) + _mark(device) for device in devices)
    return u' '.join(parts)
