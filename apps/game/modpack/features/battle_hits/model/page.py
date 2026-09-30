# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import COLOR_MUTED, COLOR_NEUTRAL, font, format_epoch, format_number
from .book import summary
from .constants import ACTION_CLEAR, MAX_DETAIL_HITS, MIDDLE, MINUS, PART_ORDER, SEPARATOR, SIDED_PARTS, SIDES
from .figure import figure_of
from .points import side_of


def totals_text(counts, translate):
    return translate(
        'battle_hits_totals',
        pen=counts['pen'] + counts['crit'],
        blocked=counts['blocked'] + counts['nodamage'],
        ricochet=counts['ricochet'],
    )


def count_line(stats, translate):
    return translate('battle_hits_count', hits=stats['hits']) + u': ' + totals_text(stats['counts'], translate)


def side_counts(stats, part, translate):
    if part not in SIDED_PARTS:
        return []
    part_sides = stats['sides'][part]
    return [u'%s %d' % (translate('battle_hits_side_' + side), part_sides[side]) for side in SIDES if part_sides[side]]


def part_text(stats, part, translate):
    label = translate('battle_hits_part_' + part)
    sides = side_counts(stats, part, translate)
    if sides:
        return u'%s: %s' % (label, u', '.join(sides))
    return u'%s %d' % (label, stats['parts'][part])


def parts_text(stats, translate):
    items = [part_text(stats, part, translate) for part in PART_ORDER if stats['parts'][part]]
    return SEPARATOR.join(items)


def where_text(entry, translate):
    part = translate('battle_hits_part_' + entry['part'])
    side = side_of(entry['part'], entry.get('x', MIDDLE), entry.get('z', MIDDLE))
    if not side:
        return part
    return translate('battle_hits_where', part=part, side=translate('battle_hits_side_' + side))


def hit_line(entry, translate, show_attacker):
    parts = [where_text(entry, translate), translate('battle_hits_outcome_' + entry['outcome'])]
    if entry.get('damage'):
        parts.append(MINUS + format_number(entry['damage']))
    if show_attacker and entry.get('attacker'):
        parts.append(entry['attacker'])
    return SEPARATOR.join(parts)


def details_of(battle, stats, translate, show_attacker):
    details = [{'label': translate('battle_hits_parts'), 'value': parts_text(stats, translate)}]
    shown_hits = (battle.get('hits') or [])[:MAX_DETAIL_HITS]
    for number, entry in enumerate(shown_hits, 1):
        details.append({'label': u'%d' % number, 'value': hit_line(entry, translate, show_attacker)})
    return details


def meta_of(battle, stats, translate):
    meta = format_epoch(battle.get('t')) or u''
    if stats['damage']:
        meta += SEPARATOR + translate('battle_hits_damage', damage=format_number(stats['damage']))
    return meta


def clear_action(translate):
    return {
        'id': ACTION_CLEAR,
        'label': translate('battle_hits_clear'),
        'confirm': translate('battle_hits_clear_confirm'),
    }


def row_of(battle, translate, show_attacker):
    stats = summary(battle)
    return {
        'id': battle['id'],
        'title': battle.get('vehicle') or u'?',
        'subtitle': count_line(stats, translate),
        'meta': meta_of(battle, stats, translate),
        'badge': None,
        'link': None,
        'details': details_of(battle, stats, translate, show_attacker),
        'figure': figure_of(battle),
        'actions': [clear_action(translate)],
    }


def build_page(book, translate, show_attacker):
    return {
        'kind': 'list',
        'empty': translate('battle_hits_empty'),
        'rows': [row_of(battle, translate, show_attacker) for battle in book.ordered()],
    }


def panel_text(battle, translate):
    stats = summary(battle)
    title = translate('battle_hits_title', vehicle=battle.get('vehicle') or u'?')
    lines = [font(title, COLOR_NEUTRAL, 15), font(count_line(stats, translate), COLOR_NEUTRAL)]

    parts = parts_text(stats, translate)
    if parts:
        lines.append(font(parts, COLOR_MUTED))
    return u'\n'.join(lines)
