from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number, string_types, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font
from ....core.shells import SHELL_CODES
from ....core.templates import render
from ....core.vendor import attr
from .constants import (
    AMMO_RACK_WINDOW_S,
    CLASS_GLYPHS,
    COLOR_MACROS,
    DETAIL_EXTENDED,
    DETAIL_FULL,
    DETAIL_SHORT,
    ENTRY_TEMPLATES,
    ICON_RENDITION,
    ICON_ROOT,
    KIND_COLOR,
    KINDS,
    LOG_KIND_FILTER,
    MAX_ENTRIES,
    MIN_ENTRY_FONT_SIZE,
    PALETTES,
    SOURCES,
    SUMMARY_KEYS,
)


@attr.s
class Hit(object):

    vehicle = attr.ib(default=None)
    shell = attr.ib(default=None)
    source = attr.ib(default=None)
    vehicle_class = attr.ib(default=None)
    at = attr.ib(default=None)
    shell_name = attr.ib(default=None)
    gold = attr.ib(default=False)


def _is_amount(amount):
    return is_number(amount) and amount > 0


def _new_entry(kind, amount, hit):
    is_received = kind == 'received'
    return {
        'kind': kind,
        'amount': amount,
        'vehicle': to_text(hit.vehicle) if hit.vehicle else None,
        'shell': hit.shell if hit.shell in SHELL_CODES else None,
        'source': hit.source if is_received and hit.source in SOURCES else None,
        'class': hit.vehicle_class if hit.vehicle_class in CLASS_GLYPHS else None,
        'ammo_rack': False,
        'at': hit.at,
        'shell_name': hit.shell_name if isinstance(hit.shell_name, string_types) else None,
        'gold': bool(hit.gold),
    }


def _near(earlier, later):
    if earlier is None or later is None:
        return False

    return abs(later - earlier) <= AMMO_RACK_WINDOW_S


class DamageLog(object):

    def __init__(self):
        self.totals = dict((kind, 0) for kind in KINDS)
        self.counts = dict((kind, 0) for kind in KINDS)
        self.summary = {}
        self.entries = []
        self.ammo_rack_at = None

    def add(self, kind, amount, hit=None):
        if kind not in KINDS or not _is_amount(amount):
            return False

        amount = int(amount)
        self.totals[kind] += amount
        self.counts[kind] += 1
        entry = _new_entry(kind, amount, hit or Hit())
        if kind == 'received' and _near(self.ammo_rack_at, entry['at']):
            entry['ammo_rack'] = True
            self.ammo_rack_at = None

        self.entries.append(entry)
        del self.entries[:-MAX_ENTRIES]
        return True

    # The damage event may come before or after the ammo rack device state.
    def ammo_rack_hit(self, at):
        received = self.last('received')
        if received is not None and _near(received['at'], at) and not received['ammo_rack']:
            received['ammo_rack'] = True
            return True

        self.ammo_rack_at = at
        return False

    def last(self, kind):
        for entry in reversed(self.entries):
            if entry['kind'] == kind:
                return entry
        return None

    def apply_summary(self, damage=None, assist=None, blocked=None, stun=None):
        changed = False
        for key, value in zip(SUMMARY_KEYS, (damage, assist, blocked, stun)):
            if is_number(value) and value >= 0 and self.summary.get(key) != int(value):
                self.summary[key] = int(value)
                changed = True
        return changed

    def values(self):
        totals = self.totals
        summary = self.summary
        stun = max(totals['stun'], summary.get('stun', 0))
        radio_track = max(totals['radio'] + totals['track'], summary.get('assist', 0))
        return {
            'dealt': max(totals['damage'], summary.get('damage', 0)),
            'blocked': max(totals['blocked'], summary.get('blocked', 0)),
            'assisted': radio_track + stun,
            'assist_radio': totals['radio'],
            'assist_track': totals['track'],
            'assist_stun': stun,
            'received': totals['received'],
            'hits': self.counts['damage'],
            'blocked_hits': self.counts['blocked'],
            'received_hits': self.counts['received'],
        }

    def recent(self, limit, kinds=KINDS):
        if limit <= 0:
            return []

        picked = [entry for entry in self.entries if entry['kind'] in kinds]
        return list(reversed(picked[-limit:]))


def totals_template(settings, translate):
    style = settings.get('style')
    if style == 'custom':
        return settings.get('template')

    return translate('dlog_template_' + style)


def palette_values(settings):
    colors = PALETTES.get(settings.get('palette'), PALETTES['classic'])
    return dict(zip(COLOR_MACROS, colors))


def kind_color(kind, settings):
    macro, key = KIND_COLOR[kind]
    return settings.get(key) or palette_values(settings)[macro]


def kind_icon(kind, size):
    path = '%s/%s_%d.png' % (ICON_ROOT, kind, ICON_RENDITION)
    return '<img src="img://%s" width="%d" height="%d"/>' % (path, size, size)


def class_icon(vehicle_class, size):
    glyph = CLASS_GLYPHS.get(vehicle_class)
    if not glyph or not size:
        return ''

    return kind_icon(glyph, size)


def source_text(entry, translate):
    parts = []
    if entry.get('source') and entry['source'] != 'shot':
        parts.append(translate('dlog_source_' + entry['source']))
    if entry.get('ammo_rack'):
        parts.append(translate('dlog_source_ammo_rack'))
    return ', '.join(parts)


def entry_values(entry, translate, index, icon_size=None, settings=None):
    kind = entry['kind']
    shell = entry.get('shell')
    return {
        'icon': kind_icon(kind, icon_size) if icon_size else '',
        'class': class_icon(entry.get('class'), icon_size),
        'index': index,
        'amount': entry['amount'],
        'kind': translate('dlog_kind_' + kind),
        'vehicle': entry.get('vehicle') or '',
        'shell': translate('dlog_shell_' + shell) if shell else '',
        'source': source_text(entry, translate),
        'color': kind_color(kind, settings) if settings is not None else COLOR_MUTED,
    }


def detail_mode(settings, extended):
    if not settings.get('alt_mode'):
        return DETAIL_FULL

    return DETAIL_EXTENDED if extended else DETAIL_SHORT


# Holding Alt shows the log even where the style or `show_log` leaves it out, as the stock log does in its
# "show by Alt" mode (damage_log_panel _VIEW_MODE.SHOW_BY_ALT_PRESS, RU 1.45 client source).
def shows_log(settings, detail):
    return bool(settings.get('show_log')) or detail == DETAIL_EXTENDED


def entry_template(settings, translate, detail):
    custom_key, built_in_key = ENTRY_TEMPLATES[detail]
    return settings.get(custom_key) or translate(built_in_key)


def entry_note(entry, translate, detail):
    if detail != DETAIL_EXTENDED:
        return ''

    item = entry_values(entry, translate, 1)
    words = (item['kind'], item['shell'], item['source'])
    return ' '.join(word for word in words if word)


def totals_line(log, settings, translate):
    values = log.values()
    values.update(palette_values(settings))
    text = render(totals_template(settings, translate), values)
    return font(text, COLOR_NEUTRAL, settings.get('font_size'))


def entry_lines(log, settings, translate, detail):
    kinds = LOG_KIND_FILTER.get(settings.get('log_kinds'), KINDS)
    template = entry_template(settings, translate, detail)
    entry_size = max(MIN_ENTRY_FONT_SIZE, settings.get('font_size') - 2)
    icon_size = entry_size + 2 if settings.get('kind_icons') else None

    lines = []
    for index, entry in enumerate(log.recent(settings.get('log_lines'), kinds)):
        item = entry_values(entry, translate, index + 1, icon_size, settings)
        color = item['color'] if settings.get('kind_colors') else COLOR_MUTED
        lines.append(font(render(template, item).strip(), color, entry_size))
    return lines


def format_damage_log(log, settings, translate, extended=False):
    detail = detail_mode(settings, extended)

    lines = [totals_line(log, settings, translate)]
    if shows_log(settings, detail):
        lines.extend(entry_lines(log, settings, translate, detail))
    return '\n'.join(lines)


def format_last_hit(entry, settings, translate):
    size = settings.get('font_size')
    class_size = size + 2 if settings.get('show_class') else None
    template = settings.get('template') or translate('dlog_last_hit_template')

    item = entry_values(entry, translate, 1, class_size, settings)
    item['icon'] = ''
    text = render(template, item).strip()
    return font(text, kind_color('received', settings), size)
