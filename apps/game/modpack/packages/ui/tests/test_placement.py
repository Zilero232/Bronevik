# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import io
import json
import os
import unittest

import _support  # noqa: F401
from otmetki.ui.components import CONTEXTS, PLACEMENT, SECTIONS, placement_of
from otmetki.ui.window_layout import unmoved_layout

CATALOG = os.path.join(_support.MODPACK_DIR, 'catalog', 'catalog.json')
WINDOW_ONLY = ('core', 'ui')
OLD_BUTTON = {'x': -24, 'y': 72, 'align_x': 'right', 'align_y': 'top', 'scale': 100}
NEW_BUTTON = {'x': -176, 'y': -4, 'align_x': 'right', 'align_y': 'bottom', 'scale': 90}


def catalog_contexts():
    with io.open(CATALOG, 'r', encoding='utf-8') as handle:
        entries = json.load(handle)['components']
    return dict((entry['id'], entry['context']) for entry in entries if entry.get('kind') is None)


def placed_components():
    contexts = catalog_contexts()
    placed = [component_id for component_id in contexts if component_id not in WINDOW_ONLY]
    return dict((component_id, contexts[component_id]) for component_id in placed)


class PlacementTest(unittest.TestCase):

    def test_every_catalogued_component_has_a_page(self):
        missing = [component_id for component_id in placed_components() if component_id not in PLACEMENT]

        assert missing == []

    def test_every_page_placement_has_the_catalog_context(self):
        contexts = placed_components()

        mismatched = [
            (component_id, PLACEMENT[component_id][1], context)
            for component_id, context in contexts.items()
            if component_id in PLACEMENT and PLACEMENT[component_id][1] != context
        ]

        assert mismatched == []

    def test_placements_use_known_sections(self):
        unknown = [component_id for component_id, (section, _) in PLACEMENT.items() if section not in SECTIONS]

        assert unknown == []

    def test_placements_use_known_contexts(self):
        unknown = [component_id for component_id, (_, context) in PLACEMENT.items() if context not in CONTEXTS]

        assert unknown == []

    def test_an_unknown_panel_goes_to_battle(self):
        assert placement_of('new_panel', 'battle', panel=True) == ('battle', 'battle')

    def test_an_unknown_hangar_component_goes_to_hangar(self):
        assert placement_of('new_label', 'hangar') == ('hangar', 'hangar')

    def test_an_unknown_data_component_goes_to_data_in_the_hangar(self):
        assert placement_of('new_share', 'data') == ('data', 'hangar')

    def test_a_known_component_keeps_its_placement_whatever_its_group(self):
        assert placement_of('marks_panel', 'hangar') == ('marks', 'battle')


class HangarButtonLayoutTest(unittest.TestCase):

    def test_a_button_nobody_moved_takes_the_new_spot(self):
        assert unmoved_layout(dict(OLD_BUTTON, drag=True), OLD_BUTTON, NEW_BUTTON) == NEW_BUTTON

    def test_a_moved_button_stays(self):
        assert unmoved_layout(dict(OLD_BUTTON, x=-40), OLD_BUTTON, NEW_BUTTON) == {}


if __name__ == '__main__':
    unittest.main()
