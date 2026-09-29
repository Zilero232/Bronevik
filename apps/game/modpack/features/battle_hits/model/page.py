# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font, format_epoch, format_number
from .book import summary
from .constants import ACTION_CLEAR, MAX_DETAIL_HITS, MINUS, PART_ORDER, SEPARATOR, SIDED_PARTS, SIDES
from .figure import figure_of
from .points import side_of


def totals_text(counts, translate):
    return translate('battle_hits_totals', pen=counts['pen'] + counts['crit'], blocked=counts['blocked'] + counts['nodamage'],
                     ricochet=counts['ricochet'])


def parts_text(stats, translate):
    items = []
    for part in PART_ORDER:
        count = stats['parts'][part]
        if not count:
            continue
        label = translate('battle_hits_part_' + part)
        if part in SIDED_PARTS:
            sides = [u'%s %d' % (translate('battle_hits_side_' + side), stats['sides'][part][side]) for side in SIDES if stats['sides'][part][side]]
            items.append(u'%s: %s' % (label, u', '.join(sides)) if sides else u'%s %d' % (label, count))
        else:
            items.append(u'%s %d' % (label, count))
    return SEPARATOR.join(items)


def hit_line(entry, translate, show_attacker):
    part = translate('battle_hits_part_' + entry['part'])
    side = side_of(entry['part'], entry.get('x', 0.5), entry.get('z', 0.5))
    parts = [translate('battle_hits_where', part=part, side=translate('battle_hits_side_' + side)) if side else part,
             translate('battle_hits_outcome_' + entry['outcome'])]
    if entry.get('damage'):
        parts.append(MINUS + format_number(entry['damage']))
    if show_attacker and entry.get('attacker'):
        parts.append(entry['attacker'])
    return SEPARATOR.join(parts)


def row_of(battle, translate, show_attacker):
    stats = summary(battle)
    hits = battle.get('hits') or []
    details = [{'label': translate('battle_hits_parts'), 'value': parts_text(stats, translate)}]
    details.extend({'label': u'%d' % (index + 1), 'value': hit_line(entry, translate, show_attacker)}
                   for index, entry in enumerate(hits[:MAX_DETAIL_HITS]))
    meta = format_epoch(battle.get('t')) or u''
    if stats['damage']:
        meta += SEPARATOR + translate('battle_hits_damage', damage=format_number(stats['damage']))
    return {
        'id': battle['id'],
        'title': battle.get('vehicle') or u'?',
        'subtitle': translate('battle_hits_count', hits=stats['hits']) + u': ' + totals_text(stats['counts'], translate),
        'meta': meta,
        'badge': None,
        'link': None,
        'details': details,
        'figure': figure_of(battle),
        'actions': [{'id': ACTION_CLEAR, 'label': translate('battle_hits_clear'), 'confirm': translate('battle_hits_clear_confirm')}],
    }


def build_page(book, translate, show_attacker):
    return {'kind': 'list', 'empty': translate('battle_hits_empty'),
            'rows': [row_of(battle, translate, show_attacker) for battle in book.ordered()]}


def panel_text(battle, translate):
    stats = summary(battle)
    title = translate('battle_hits_title', vehicle=battle.get('vehicle') or u'?')
    lines = [font(title, COLOR_NEUTRAL, 15),
             font(translate('battle_hits_count', hits=stats['hits']) + u': ' + totals_text(stats['counts'], translate), COLOR_NEUTRAL)]
    parts = parts_text(stats, translate)
    if parts:
        lines.append(font(parts, COLOR_MUTED))
    return u'\n'.join(lines)
