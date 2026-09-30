# -*- coding: utf-8 -*-
import importlib
import unittest

import _support  # noqa: F401
from otmetki.core.hud.panel import DOCK_ANCHORS
from otmetki.core.settings import Settings

# Every battle screen the client allows, as (width, height, interface scale): gui/shared/utils/graphics.py _SCALES.
SCREENS = (
    (1920, 1080, 1.0),
    (2560, 1440, 1.0),
    (2560, 1440, 1.25),
    (2560, 1440, 1.5),
    (3840, 2160, 1.0),
    (3840, 2160, 1.25),
    (3840, 2160, 1.5),
    (3840, 2160, 1.75),
    (3840, 2160, 2.0),
)
# The size a panel is checked at: the widest card the HUD page draws, two text lines high; the team HP numbers beside
# the stock strip at their default font size.
PANEL_SIZE = (260, 40)
TEAM_HP_NUMBERS_SIZE = (180, 40)
# Stock boxes in the middle of the top edge (RU 1.45 gui_battle AS3), design px as (half width off the centre, top,
# bottom). The score strip: HP bars of 234 px from 109 px off the centre (BaseTeamHealthBar.as), vehicle markers down
# to about 60. The capture bars: two of 34 px from y 62 (TeamBasesPanel.as, EpicBattlePage.as). The quest progress:
# from the bases' top + 45 plus their height (BattlePage.updatePositionForQuestProgress), items 60 px apart
# (QuestProgressTopViewItemsPos.as).
SCORE_STRIP = (345, 0, 60)
CAPTURE_BARS = (200, 62, 130)
QUEST_PROGRESS = (200, 107, 245)
# The stock timer at the top right (battleTimer, 184 px) and the battle clock left of it.
TIMER_WIDTH = 184
BATTLE_CLOCK_WIDTH = 90
BATTLE_PANELS = (
    'arty_meter', 'battle_clock', 'battle_efficiency', 'battle_loadout', 'consumables', 'damage_log', 'death_card',
    'gun_arc', 'hit_log', 'main_gun', 'marks_panel', 'personal_best', 'personal_missions', 'platoon_points',
    'received_hits', 'reload_timer', 'session_goals', 'sixth_sense',
)


def design_screen(width, height, scale):
    return width / scale, height / scale


def offset(align, size, extent):
    if align in ('left', 'top'):
        return 0
    if align == 'center':
        return (extent - size) / 2
    return extent - size


def panel_rect(place, screen, size=PANEL_SIZE):
    width, height = size
    left = offset(place['align_x'], width, screen[0]) + place['x']
    top = offset(place['align_y'], height, screen[1]) + place['y']
    return left, top, left + width, top + height


def centre_box(box, screen):
    half_width, top, bottom = box
    centre = screen[0] / 2
    return centre - half_width, top, centre + half_width, bottom


def overlaps(first, second):
    horizontally = first[0] < second[2] and second[0] < first[2]
    vertically = first[1] < second[3] and second[1] < first[3]
    return horizontally and vertically


def default_place(feature_id):
    settings = importlib.import_module('otmetki.features.%s.settings' % feature_id)
    return settings.SCHEMA.defaults


def battle_places():
    places = dict((feature_id, default_place(feature_id)) for feature_id in BATTLE_PANELS)
    for group, anchor in DOCK_ANCHORS.items():
        if group.startswith('battle_'):
            places['dock:' + group] = anchor
    return places


def team_hp_beside_stock():
    from otmetki.features.team_hp.model import pinned_place
    from otmetki.features.team_hp.settings import SCHEMA

    settings = Settings({'style': 'numbers'}, SCHEMA)
    x, y = pinned_place(settings)
    return {'x': x, 'y': y, 'align_x': 'center', 'align_y': 'top'}


def team_hp_rect(place, screen):
    return panel_rect(place, design_screen(*screen), TEAM_HP_NUMBERS_SIZE)


def covers(rect, box, screen):
    """Whether a panel at `rect` on `screen` (as listed in SCREENS) overlaps the stock `box`."""
    return overlaps(rect, centre_box(box, design_screen(*screen)))


def clock_left_edge(screen):
    return design_screen(*screen)[0] - TIMER_WIDTH - BATTLE_CLOCK_WIDTH


class StockBoxesTest(unittest.TestCase):

    def test_no_default_battle_place_covers_the_capture_bars_or_the_quest_progress(self):
        stock = (CAPTURE_BARS, QUEST_PROGRESS)

        covered = [
            (name, screen)
            for screen in SCREENS
            for name, place in sorted(battle_places().items())
            for box in stock
            if covers(panel_rect(place, design_screen(*screen)), box, screen)
        ]

        assert covered == []

    def test_team_hp_beside_the_stock_strip_covers_no_stock_box(self):
        stock = (SCORE_STRIP, CAPTURE_BARS, QUEST_PROGRESS)
        place = team_hp_beside_stock()

        covered = [screen for screen in SCREENS for box in stock if covers(team_hp_rect(place, screen), box, screen)]

        assert covered == []

    def test_team_hp_beside_the_stock_strip_stays_left_of_the_clock_and_the_timer(self):
        place = team_hp_beside_stock()

        crowded = [screen for screen in SCREENS if team_hp_rect(place, screen)[2] > clock_left_edge(screen)]

        assert crowded == []


if __name__ == '__main__':
    unittest.main()
