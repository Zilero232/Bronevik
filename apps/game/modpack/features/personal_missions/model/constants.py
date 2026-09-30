# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.panel import dock_layout

STATES = ('in_progress', 'done', 'honors')
MAX_MISSIONS = 60
MAX_TEXT = 200
DONE_MARK = u'✓'
HONORS_MARK = u'✓✓'
TITLE_SIZE_STEP = 2
# The card (model/widget.py): its width in design px and the row status mark of each mission state.
CARD_WIDTH = 260
STATUS_OF = {'in_progress': 'active', 'done': 'done', 'honors': 'honors'}
# The missions screen changes the missions in the hangar: the label re-reads them this often.
REFRESH_EVERY_S = 10.0

HANGAR_PANEL = 'otmetki.personal_missions'
HANGAR_LAYOUT = dock_layout('hangar_right')

PREVIEW_SIZE = (380, 70)
PREVIEW_MISSIONS = (
    {'id': 1, 'name': u'СТ-7. Огневая поддержка', 'main': u'Нанести 3000 урона', 'extra': u'Не получить повреждений от ТТ',
     'state': 'in_progress', 'classes': ['mediumTank']},
    {'id': 2, 'name': u'ТТ-3. Прорыв', 'main': u'Уничтожить 2 машины', 'extra': u'', 'state': 'in_progress', 'classes': ['heavyTank']},
    {'id': 3, 'name': u'ЛТ-1. Разведка', 'main': u'', 'extra': u'', 'state': 'honors', 'classes': ['lightTank']},
)
