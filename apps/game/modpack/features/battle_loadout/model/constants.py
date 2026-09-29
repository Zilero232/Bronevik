# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import re

# The tanks whose hangar loadout is kept for the next battle (the selected one and the last few).
MAX_TANKS = 8
MAX_ITEMS = 8
MAX_NAME = 40
# The client's item icons are relative Scaleform paths (RU 1.45 gui items: `../maps/icons/artefact/<name>.png`);
# the HUD labels read them as img://gui/maps/...
ICON_PREFIX = '../maps/'
IMG_ROOT = 'gui/maps/'
ICON_PATH = re.compile(r'^[A-Za-z0-9_./-]{1,160}\.png$')
BONUS_MARK = u'★'
SEPARATOR = u' · '

PREVIEW_SIZE = (360, 70)

KIND = 'battle_loadout'
PREVIEW_LOADOUT = {
    'devices': [
        {'name': u'Турбонагнетатель', 'icon': '../maps/icons/artefact/turbocharger.png', 'bonus': True},
        {'name': u'Вентиляция', 'icon': '../maps/icons/artefact/improvedVentilation.png', 'bonus': False},
        {'name': u'Досылатель', 'icon': '../maps/icons/artefact/rammer.png', 'bonus': True},
    ],
    'modifications': [u'Скорость сведения', u'Обзор'],
    'directives': [{'name': u'Боевое братство', 'icon': None}],
}
