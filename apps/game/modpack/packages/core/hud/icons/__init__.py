"""Image strings for widget payloads: client images by path (`img://gui/maps/icons/...`) and our own glyphs (`otmetki:<name>`).

We only reference what the player's client already has; nothing is copied. `image(path, fallback)` adds a fallback glyph
after `|`: the page draws it when the image fails, and `resolve(value, exists)` swaps a missing client file for it before
the payload is sent (the client side passes a `ResMgr.isFile` check). Paths are from the RU 1.45 client
(docs/specs/2026-09-29-hud-visual-redesign.md section 2.4).
"""
from __future__ import absolute_import, division, print_function, unicode_literals

import os.path

from ...compat import is_int, string_types, to_text
from .constants import (CLASS_GLYPHS, CLASS_TAGS, CLASS_TINTS, EFFICIENCY, FALLBACK_SEPARATOR, GLYPH_SCHEME, ICON_NAME_LIMIT, ICONS_ROOT,
                        IMAGE_SCHEME, LOWER_CASE_TINTS, MAX_MARKS, MAX_TIER, NATIONS, OUTCOME_FILES, OUTCOME_GLYPHS, PREMIUM_SHELLS,
                        PREMIUM_SUFFIX, SHELL_CODE_FILES, SHELL_FILES, SHELL_STEM)

__all__ = ('artefact_icon', 'class_icon', 'efficiency_icon', 'flag_icon', 'glyph', 'image', 'item_name', 'mark_icon', 'outcome_icon',
           'resolve', 'shell_icon', 'shell_icon_of', 'split', 'tier_icon')


def glyph(name):
    return GLYPH_SCHEME + name


def image(path, fallback=None):
    """`img://<path>`, with `|otmetki:<fallback>` when a glyph stands in for a missing file."""
    value = IMAGE_SCHEME + path
    return value + FALLBACK_SEPARATOR + glyph(fallback) if fallback else value


def split(value):
    """(client path or None, fallback glyph string or None) of an image string."""
    if not isinstance(value, string_types):
        return None, None
    head, _, tail = to_text(value).partition(FALLBACK_SEPARATOR)
    path = head[len(IMAGE_SCHEME):] if head.startswith(IMAGE_SCHEME) else None
    fallback = tail if tail.startswith(GLYPH_SCHEME) else (head if head.startswith(GLYPH_SCHEME) else None)
    return path, fallback


def item_name(raw):
    """The file stem of a client descriptor icon (`descriptor.icon[0]`: a name, a file name or a relative path)."""
    if isinstance(raw, (tuple, list)):
        raw = raw[0] if raw else None
    if not isinstance(raw, string_types) or not raw:
        return None
    stem = os.path.splitext(os.path.basename(to_text(raw).replace('\\', '/')))[0]
    return stem if stem and len(stem) <= ICON_NAME_LIMIT and '..' not in stem else None


def class_icon(tag, tint='white'):
    """The class icon of a vehicle class tag in `white`, `green` (ally), `red` (enemy) or `gold` (own), or None."""
    if tag not in CLASS_TAGS:
        return None
    tint = tint if tint in CLASS_TINTS else 'white'
    name = tag.lower() if tint in LOWER_CASE_TINTS and tag in ('AT-SPG', 'SPG') else tag
    return image('%s/vehicleTypes/%s/%s.png' % (ICONS_ROOT, tint, name), CLASS_GLYPHS[tag])


def shell_icon(name, premium=False, kind='small'):
    """A shell icon from its BATTLE_LOG_SHELL_TYPES name or the stem of its descriptor icon: `small` flat, or `battle_ammo`."""
    stem = SHELL_FILES.get(name) or (item_name(name) if isinstance(name, string_types) and SHELL_STEM.match(name) else None)
    if stem is None:
        return None
    if premium and stem in PREMIUM_SHELLS and not stem.endswith(PREMIUM_SUFFIX):
        stem += PREMIUM_SUFFIX
    folder = 'ammopanel/battle_ammo' if kind == 'battle_ammo' else 'shell/small'
    return image('%s/%s/%s.png' % (ICONS_ROOT, folder, stem), 'damage')


def shell_icon_of(code, premium=False, kind='small'):
    """A shell icon from our short code (`core.shells`: ap, apcr, heat, he, flame)."""
    stem = SHELL_CODE_FILES.get(code)
    return shell_icon(stem, premium, kind) if stem else None


def artefact_icon(name):
    """A consumable, equipment or directive icon (artefact/<name>.png) from its descriptor icon."""
    stem = item_name(name)
    return image('%s/artefact/%s.png' % (ICONS_ROOT, stem)) if stem else None


def efficiency_icon(kind):
    return image('%s/library/efficiency/48x48/%s.png' % (ICONS_ROOT, kind), 'damage') if kind in EFFICIENCY else None


def outcome_icon(outcome):
    fallback = OUTCOME_GLYPHS.get(outcome)
    stem = OUTCOME_FILES.get(outcome)
    if stem is None:
        return glyph(fallback) if fallback else None
    return image('%s/library/critical_damage/%s.png' % (ICONS_ROOT, stem), fallback)


def mark_icon(marks):
    if not is_int(marks) or marks <= 0:
        return None
    return image('%s/library/marksOnGun/mark_%d.png' % (ICONS_ROOT, min(marks, MAX_MARKS)), 'target')


def flag_icon(nation):
    return image('%s/flags/25x17/%s.png' % (ICONS_ROOT, nation)) if nation in NATIONS else None


def tier_icon(tier):
    return image('%s/levels/tank_level_small_%d.png' % (ICONS_ROOT, tier)) if is_int(tier) and 1 <= tier <= MAX_TIER else None


def resolve(value, exists):
    """`value` (a widget payload) with every client image whose file `exists(path)` denies replaced by its fallback glyph
    (or None when it has none)."""
    if isinstance(value, dict):
        return dict((key, resolve(item, exists)) for key, item in value.items())
    if isinstance(value, list):
        return [resolve(item, exists) for item in value]
    if isinstance(value, string_types) and to_text(value).startswith(IMAGE_SCHEME):
        path, fallback = split(value)
        if path is not None and not exists(path):
            return fallback
    return value
