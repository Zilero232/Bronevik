# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

MAX_ITEMS = 5
MAX_NAME = 60
MAX_EFFECT = 240
# The stock marks of a special device over its icon (RU 1.45 gui/shared/gui_items/artefacts.py getOverlayType): deluxe
# (the «+» devices), modernized by level, trophy and upgraded trophy.
OVERLAY_PATH = 'gui/maps/icons/quests/bonuses/small/%s_overlay.png'
OVERLAY_DELUXE = 'equipmentPlus'
OVERLAY_MODERNIZED = 'equipmentModernized_%d'
OVERLAY_TROPHIES = {'basic': 'equipmentTrophyBasic', 'upgraded': 'equipmentTrophyUpgraded'}
MAX_MODERNIZED_LEVEL = 3
ICON_FALLBACK = 'module'
BONUS_MARK = u'★'

PREVIEW_SIZE = (180, 44)

KIND = 'battle_loadout'
PREVIEW_DEVICES = [
    {'name': u'Турбонагнетатель', 'effect': u'+10 % к максимальной скорости и мощности двигателя.', 'icon': 'turbocharger', 'bonus': True},
    {'name': u'Улучшенная вентиляция', 'effect': u'+5 % к основным навыкам экипажа.', 'icon': 'improvedVentilation', 'bonus': False,
     'deluxe': True},
    {'name': u'Досылатель', 'effect': u'−10 % к времени перезарядки.', 'icon': 'rammer', 'bonus': True},
]
