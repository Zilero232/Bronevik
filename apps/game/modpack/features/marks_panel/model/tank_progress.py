# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import counted, format_number
from ....core.hud.widget import card_row
from ....core.moe import mastery_state
from .constants import APPROX, METRIC_SEPARATOR, RESEARCH_ROWS

# The Tank card's Alt rows about the tank's own progress besides the marks: the base XP one battle needs for each
# mastery badge (the site's thresholds, the protanki idea) and the XP still to research (izeberg «vehicle_exp»).


def _badge(level, translate):
    return translate('marks_panel_card_mastery_%d' % level)


def _next_badge(badges):
    for badge in badges:
        if not badge['reached']:
            return badge
    return None


def _badges_line(badges, translate):
    parts = [u'%s %s' % (_badge(badge['level'], translate), format_number(badge['xp'])) for badge in badges]
    return METRIC_SEPARATOR.join(parts)


def mastery_row(levels, own_level, translate):
    badges = mastery_state(levels, own_level)
    if not badges:
        return None
    detail = _badges_line(badges, translate)
    badge = _next_badge(badges)
    label = translate('marks_panel_card_mastery')
    if badge is None:
        text = _badge(badges[-1]['level'], translate)
        reached = translate('marks_panel_card_reached')
        return card_row(text, reached, label=label, status='done', tone_name='good', detail=detail)
    note = translate('marks_panel_card_xp_per_battle')
    text = _badge(badge['level'], translate)
    return card_row(text, format_number(badge['xp']), label=label, note=note, detail=detail)


def mastery_line(levels, own_level, translate):
    badges = mastery_state(levels, own_level)
    if not badges:
        return None
    return u'%s: %s' % (translate('marks_panel_card_mastery_xp'), _badges_line(badges, translate))


def _battles(battles, translate):
    return APPROX + counted(battles, 'battles', translate) if battles else None


def _need(need, translate):
    return format_number(need) if need else translate('marks_panel_card_research_ready')


def research_rows(research, translate):
    if research is None:
        return []
    rows = []
    if research['elite'] is not None:
        need = _need(research['elite'], translate)
        note = _battles(research['elite_battles'], translate)
        rows.append(card_row(translate('marks_panel_card_to_elite'), need, note=note, text_tone='muted'))
    label = translate('marks_panel_card_to_research')
    for vehicle in research['vehicles'][:RESEARCH_ROWS]:
        need = _need(vehicle['need'], translate)
        note = _battles(vehicle['battles'], translate)
        rows.append(card_row(vehicle['name'], need, label=label, note=note, text_tone='muted'))
    return rows


def _research_part(label, need, battles, translate):
    battles_text = _battles(battles, translate)
    text = u'%s %s' % (label, _need(need, translate))
    return u'%s (%s)' % (text, battles_text) if battles_text else text


def research_line(research, translate):
    if research is None:
        return None
    parts = []
    if research['elite'] is not None:
        label = translate('marks_panel_card_to_elite')
        parts.append(_research_part(label, research['elite'], research['elite_battles'], translate))
    for vehicle in research['vehicles'][:RESEARCH_ROWS]:
        parts.append(_research_part(vehicle['name'], vehicle['need'], vehicle['battles'], translate))
    return METRIC_SEPARATOR.join(parts) or None
