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


def catalog_contexts():
    with io.open(CATALOG, 'r', encoding='utf-8') as handle:
        entries = json.load(handle)['components']
    return dict((entry['id'], entry['context']) for entry in entries if entry.get('kind') is None)


class PlacementTest(unittest.TestCase):

    def test_every_catalogued_component_has_a_page_and_the_catalog_context(self):
        contexts = catalog_contexts()
        for component_id, context in contexts.items():
            if component_id in WINDOW_ONLY:
                continue
            assert component_id in PLACEMENT, component_id
            assert PLACEMENT[component_id][1] == context, (component_id, PLACEMENT[component_id][1], context)

    def test_placements_use_known_sections_and_contexts(self):
        for component_id, (section, context) in PLACEMENT.items():
            assert section in SECTIONS and context in CONTEXTS, component_id

    def test_unknown_components_follow_their_group(self):
        assert placement_of('new_panel', 'battle', panel=True) == ('battle', 'battle')
        assert placement_of('new_label', 'hangar') == ('hangar', 'hangar')
        assert placement_of('new_share', 'data') == ('data', 'hangar')
        assert placement_of('marks_panel', 'hangar') == ('marks', 'battle')

    def test_a_button_nobody_moved_takes_the_new_spot(self):
        old = {'x': -24, 'y': 72, 'align_x': 'right', 'align_y': 'top', 'scale': 100}
        new = {'x': -176, 'y': -4, 'align_x': 'right', 'align_y': 'bottom', 'scale': 90}
        assert unmoved_layout(dict(old, drag=True), old, new) == new
        assert unmoved_layout(dict(old, x=-40), old, new) == {}


if __name__ == '__main__':
    unittest.main()
