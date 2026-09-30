# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.panel import dock_layout

# contract/goals.schema.json: the goals set on the site's «Мой кабинет» page.
GOALS_PATH = '/mod/me/goals'
SITE_PATH = '/me'
GOALS_KEY = 'goals'
STATE_KEY = 'session_goals_done'

METRICS = ('winRate', 'wn8', 'avgDamage', 'battles', 'moe', 'broneIndex')
PERCENT_METRICS = ('winRate', 'moe')
SHOWN_STATUSES = ('active', 'achieved')
ACTIVE = 'active'
ACHIEVED = 'achieved'
MAX_GOALS = 20
MAX_REMEMBERED = 100

DONE_MARK = u'✓'
SOUND = 'otmetki_goal'

ACTION_REFRESH = 'refresh'
ACTION_SITE = 'site'

HANGAR_PANEL = 'otmetki.session_goals'
HANGAR_LAYOUT = dock_layout('hangar_right')
TITLE_SIZE_STEP = 2

PREVIEW_SIZE = (340, 50)
PREVIEW_GOALS = (
    {'id': 'preview-1', 'metric': 'avgDamage', 'tank_id': None, 'target': 3000.0, 'baseline': 2410.0, 'current': 2740.4, 'battles': 12,
     'status': 'active'},
    {'id': 'preview-2', 'metric': 'battles', 'tank_id': None, 'target': 10.0, 'baseline': 0.0, 'current': 9.0, 'battles': 9, 'status': 'active'},
)
PREVIEW_DAMAGE = 1450

# The card (model/widget.py), design px.
CARD_WIDTH = 260
