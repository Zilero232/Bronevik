# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.format import counted
from ....core.hud.icons import glyph
from ....core.hud.widget import card, card_row
from . import totals_text
from .constants import CARD_WIDTH


def member_row(member, translate):
    return card_row(member['name'], translate('platoon_helper_ready' if member['ready'] else 'platoon_helper_waiting'),
                    status='done' if member['ready'] else 'idle', tone_name='success' if member['ready'] else 'warning',
                    text_tone='text' if member['self'] else 'muted')


def session_row(key, totals, translate):
    values = totals_text(totals)
    return card_row(translate('platoon_helper_row_' + key), u'%d%%' % values['wins'], icon=glyph('session'), text_tone='muted',
                    detail=translate('platoon_helper_row_detail', battles=counted(values['battles'], 'battles', translate), damage=values['damage']))


def hangar_widget(members, session, settings, translate):
    rows, value = [], None
    if settings.get('show_members') and members:
        ready = len([member for member in members if member['ready']])
        value = u'%d/%d' % (ready, len(members))
        rows.extend(member_row(member, translate) for member in members)
    if settings.get('show_session'):
        rows.extend(session_row(key, totals, translate) for key, totals in (('platoon', session.platoon), ('clan', session.clan))
                    if totals['battles'])
    if not rows:
        return None
    return card(translate('platoon_helper_card_title'), glyph('platoon'), rows, value=value, value_tone='success', width=CARD_WIDTH)
