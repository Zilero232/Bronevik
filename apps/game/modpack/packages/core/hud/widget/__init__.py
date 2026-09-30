"""Structured panel payloads for the Gameface HUD page (protocol v3).

A panel is `{id, text, widget, ...}`: `text` stays the GUIFlash HTML, `widget` (`{kind, v, data}`, or None) is what the
Gameface page draws with its own component for `kind`. The page falls back to `text` when it does not know the kind or
the data fails its schema (`ui-web/src/entities/hud-widgets/<kind>`). Icon fields are strings from `core.hud.icons`.

`card(...)` is the shared plate of the hangar labels and the smaller battle panels (kind `card`,
`ui-web/src/entities/hud-widgets/card`): a caps header with an icon, an optional big value, rows of icon + text + value
with an optional one-line detail and a progress bar, a strip of icon + number chips, a strip of colour marks and a
dimmed footer.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...compat import is_number, string_types, to_text
from .constants import CARD_KIND, CARD_LIMITS, HEX_COLOR, RAILS, STATUSES, TONES, WIDGET_VERSION

__all__ = ('CARD_KIND', 'RAILS', 'STATUSES', 'TONES', 'WIDGET_VERSION', 'card', 'card_chip', 'card_row', 'tone', 'widget')


def widget(kind, data):
    return {'kind': kind, 'v': WIDGET_VERSION, 'data': data}


def tone(value, default='text'):
    """`value` when it is a known colour role, else `default`."""
    return value if value in TONES else default


def _text(value, limit):
    if value is None or (isinstance(value, string_types) and not value):
        return None
    if is_number(value) and not isinstance(value, bool):
        value = to_text(value)
    if not isinstance(value, string_types):
        return None
    text = to_text(value).strip()
    return text[:limit] if text else None


def _icon(value):
    return to_text(value) if isinstance(value, string_types) and value else None


def _progress(value):
    if not is_number(value) or isinstance(value, bool):
        return None
    return round(max(0.0, min(1.0, float(value))), 3)


def _color(value):
    return to_text(value).upper() if isinstance(value, string_types) and HEX_COLOR.match(value) else None


def card_row(text=None, value=None, icon=None, tone_name='text', label=None, note=None, detail=None, progress=None, status=None,
             progress_tone='accent', text_tone='text', color=None):
    """One row: `[icon|status] label text ....... value note`, then `detail` (one dimmed line) and a thin progress bar.
    `color` (`#RRGGBB`, a rating scale colour) paints the value instead of its tone."""
    limit = CARD_LIMITS['text']
    return {
        'icon': _icon(icon),
        'status': status if status in STATUSES else None,
        'label': _text(label, limit),
        'text': _text(text, limit),
        'text_tone': tone(text_tone),
        'value': _text(value, CARD_LIMITS['value']),
        'tone': tone(tone_name),
        'color': _color(color),
        'note': _text(note, CARD_LIMITS['value']),
        'detail': _text(detail, CARD_LIMITS['detail']),
        'progress': _progress(progress),
        'progress_tone': tone(progress_tone, 'accent'),
    }


def card_chip(value, icon=None, tone_name='text', label=None, color=None):
    """An icon + number in the chips strip (`label` is a dimmed caption before the number, `color` as in `card_row`)."""
    return {'icon': _icon(icon), 'value': _text(value, CARD_LIMITS['value']) or u'', 'tone': tone(tone_name),
            'label': _text(label, CARD_LIMITS['value']), 'color': _color(color)}


def _strip(marks):
    tones = [tone(mark, 'muted') for mark in marks]

    return tones[-CARD_LIMITS['strip']:]


def card(title=None, icon=None, rows=(), value=None, value_tone='text', subtitle=None, rail='info', chips=(),
         footer=None, width=None, strip=()):
    """The `card` widget: `title` in caps with `icon` and `subtitle`, `value` big on the right, then `chips`, `strip` (a
    row of small marks, one tone each, e.g. the last battles' results; the newest kept), `rows` and `footer`. `rail` is
    the plate's category (RAILS), the colour of its left edge; `width` (design px) fixes the plate's width."""
    rows = [row for row in rows if row][:CARD_LIMITS['rows']]
    chips = [chip for chip in chips if chip][:CARD_LIMITS['chips']]
    low, high = CARD_LIMITS['width']
    return widget(CARD_KIND, {
        'title': _text(title, CARD_LIMITS['title']),
        'icon': _icon(icon),
        'subtitle': _text(subtitle, CARD_LIMITS['title']),
        'value': _text(value, CARD_LIMITS['value']),
        'value_tone': tone(value_tone),
        'rail': rail if rail in RAILS else 'info',
        'chips': chips,
        'strip': _strip(strip),
        'rows': rows,
        'footer': _text(footer, CARD_LIMITS['detail']),
        'width': int(max(low, min(high, width))) if is_number(width) and not isinstance(width, bool) else None,
    })
