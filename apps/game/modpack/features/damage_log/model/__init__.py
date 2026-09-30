from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number, string_types, to_text
from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font
from ....core.shells import SHELL_CODES
from ....core.templates import render
from .constants import (AMMO_RACK_WINDOW_S, CLASS_GLYPHS, COLOR_MACROS, DETAIL_EXTENDED, DETAIL_FULL, DETAIL_SHORT,
                        ENTRY_TEMPLATES, ICON_RENDITION, ICON_ROOT, KIND_COLOR, KINDS, LOG_KIND_FILTER, MAX_ENTRIES, PALETTES,
                        SOURCES)


class DamageLog(object):

    def __init__(self):
        self.totals = dict((kind, 0) for kind in KINDS)
        self.counts = dict((kind, 0) for kind in KINDS)
        self.summary = {}
        self.entries = []
        self.ammo_rack_at = None

    def add(self, kind, amount, vehicle=None, shell=None, source=None, vehicle_class=None, at=None, shell_name=None, gold=False):
        if kind not in KINDS or not is_number(amount) or amount <= 0:
            return False
        amount = int(amount)
        self.totals[kind] += amount
        self.counts[kind] += 1
        entry = {
            'kind': kind,
            'amount': amount,
            'vehicle': to_text(vehicle) if vehicle else None,
            'shell': shell if shell in SHELL_CODES else None,
            'source': source if kind == 'received' and source in SOURCES else None,
            'class': vehicle_class if vehicle_class in CLASS_GLYPHS else None,
            'ammo_rack': False,
            'at': at,
            'shell_name': shell_name if isinstance(shell_name, string_types) else None,
            'gold': bool(gold),
        }
        if kind == 'received' and self._near(self.ammo_rack_at, at):
            entry['ammo_rack'] = True
            self.ammo_rack_at = None
        self.entries.append(entry)
        del self.entries[:-MAX_ENTRIES]
        return True

    @staticmethod
    def _near(earlier, later):
        return earlier is not None and later is not None and abs(later - earlier) <= AMMO_RACK_WINDOW_S

    # The damage event may come before or after the ammo rack device state.
    def ammo_rack_hit(self, at):
        for entry in reversed(self.entries):
            if entry['kind'] == 'received':
                if self._near(entry['at'], at) and not entry['ammo_rack']:
                    entry['ammo_rack'] = True
                    return True
                break
        self.ammo_rack_at = at
        return False

    def last(self, kind):
        for entry in reversed(self.entries):
            if entry['kind'] == kind:
                return entry
        return None

    def apply_summary(self, damage=None, assist=None, blocked=None, stun=None):
        changed = False
        for key, value in (('damage', damage), ('assist', assist), ('blocked', blocked), ('stun', stun)):
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


def image(name, size):
    return '<img src="img://%s/%s_%d.png" width="%d" height="%d"/>' % (ICON_ROOT, name, ICON_RENDITION, size, size)


def kind_icon(kind, size):
    return image(kind, size)


def class_icon(vehicle_class, size):
    glyph = CLASS_GLYPHS.get(vehicle_class)
    return image(glyph, size) if glyph and size else ''


def source_text(entry, translate):
    parts = []
    if entry.get('source') and entry['source'] != 'shot':
        parts.append(translate('dlog_source_' + entry['source']))
    if entry.get('ammo_rack'):
        parts.append(translate('dlog_source_ammo_rack'))
    return ', '.join(parts)


def entry_values(entry, translate, index, icon_size=None, settings=None):
    return {
        'icon': kind_icon(entry['kind'], icon_size) if icon_size else '',
        'class': class_icon(entry.get('class'), icon_size),
        'index': index,
        'amount': entry['amount'],
        'kind': translate('dlog_kind_' + entry['kind']),
        'vehicle': entry.get('vehicle') or '',
        'shell': translate('dlog_shell_' + entry['shell']) if entry.get('shell') else '',
        'source': source_text(entry, translate),
        'color': kind_color(entry['kind'], settings) if settings is not None else COLOR_MUTED,
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


def format_damage_log(log, settings, translate, extended=False):
    detail = detail_mode(settings, extended)
    size = settings.get('font_size')
    values = log.values()
    values.update(palette_values(settings))
    lines = [font(render(totals_template(settings, translate), values), COLOR_NEUTRAL, size)]
    if shows_log(settings, detail):
        kinds = LOG_KIND_FILTER.get(settings.get('log_kinds'), KINDS)
        template = entry_template(settings, translate, detail)
        entry_size = max(8, size - 2)
        icon_size = entry_size + 2 if settings.get('kind_icons') else None
        for index, entry in enumerate(log.recent(settings.get('log_lines'), kinds)):
            item = entry_values(entry, translate, index + 1, icon_size, settings)
            text = render(template, item).strip()
            lines.append(font(text, item['color'] if settings.get('kind_colors') else COLOR_MUTED, entry_size))
    return '\n'.join(lines)


def format_last_hit(entry, settings, translate):
    size = settings.get('font_size')
    item = entry_values(entry, translate, 1, size + 2 if settings.get('show_class') else None, settings)
    item['icon'] = ''
    text = render(settings.get('template') or translate('dlog_last_hit_template'), item).strip()
    return font(text, kind_color('received', settings), size)
