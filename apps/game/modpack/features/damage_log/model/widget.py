from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import class_icon, efficiency_icon, glyph, shell_icon, shell_icon_of
from ....core.hud.widget import widget
from . import detail_mode, entry_note
from .constants import (COMPACT_STYLES, DETAIL_EXTENDED, KIND, KIND_GLYPHS, KIND_TONES, KINDS, LAST_HIT_KIND, LOG_KIND_FILTER,
                        SOURCE_ICONS, TOTALS)

# Fair play: the player's own damage, assist, blocked and received damage, what the stock damage log shows; for
# received damage the attacker's name and class, as the stock log names it.


def total_icon(icon):
    return efficiency_icon(icon) if icon else glyph('received')


def totals(log):
    values = log.values()
    items = []
    for key, icon, tone, always in TOTALS:
        if always or values[key] > 0:
            items.append({'key': key, 'icon': total_icon(icon), 'value': values[key], 'tone': tone})
    return items


def entry_shell(entry):
    if entry.get('shell_name'):
        return shell_icon(entry['shell_name'], entry.get('gold'))
    return shell_icon_of(entry.get('shell'), entry.get('gold'))


def source_icon(source):
    found = SOURCE_ICONS.get(source)
    if found is None:
        return None
    kind, name = found
    return efficiency_icon(name) if kind == 'efficiency' else glyph(name)


def row(entry, note=''):
    kind = entry['kind']
    shell = entry_shell(entry) if kind in ('damage', 'blocked', 'received') else None
    return {
        'kind': kind,
        'amount': entry['amount'],
        'tone': KIND_TONES[kind],
        'received': kind == 'received',
        'icon': shell or glyph(KIND_GLYPHS[kind]),
        'gold': bool(entry.get('gold')) and shell is not None,
        'cls': class_icon(entry.get('class')),
        'name': entry.get('vehicle') or '',
        'source': source_icon(entry.get('source')),
        'ammo_rack': glyph('ammo_rack') if entry.get('ammo_rack') else None,
        'note': note,
    }


def is_compact(settings):
    return settings.get('style') in COMPACT_STYLES


# Holding Alt shows the rows the compact styles leave out (model shows_log).
def shows_rows(settings, detail):
    if detail == DETAIL_EXTENDED:
        return True

    return bool(settings.get('show_log')) and not is_compact(settings)


def log_rows(log, settings, translate, detail):
    if not shows_rows(settings, detail):
        return []

    kinds = LOG_KIND_FILTER.get(settings.get('log_kinds'), KINDS)
    entries = log.recent(settings.get('log_lines'), kinds)
    return [row(entry, entry_note(entry, translate, detail)) for entry in entries]


# `detail` is the row detail (model detail_mode): the page leaves the class, name and source out of a short row and
# adds the `note` (kind, shell, source in words) to an extended one.
def damage_log_widget(log, settings, translate, extended=False):
    detail = detail_mode(settings, extended)

    return widget(KIND, {
        'style': 'compact' if is_compact(settings) else 'full',
        'detail': detail,
        'totals': totals(log),
        'rows': log_rows(log, settings, translate, detail),
    })


def last_hit_widget(entry, settings):
    return widget(LAST_HIT_KIND, {
        'amount': entry['amount'],
        'name': entry.get('vehicle') or '',
        'cls': class_icon(entry.get('class'), 'red') if settings.get('show_class') else None,
        'shell': entry_shell(entry),
        'source': source_icon(entry.get('source')),
        'ammo_rack': glyph('ammo_rack') if entry.get('ammo_rack') else None,
        'timeout_s': settings.get('timeout_s'),
    })
