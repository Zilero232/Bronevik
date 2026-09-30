# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import json
import unittest

import _support  # noqa: F401
from otmetki.ui.feeds import FEED_INTERVAL_S, Feed, split_page
from otmetki.ui.protocol import PROTOCOL_VERSION, encode_feed

ITEMS = 1000


def item(index, **values):
    replay = {'id': '%04d_20260927_1405_ussr-R04_T-34_05_prohorovka.mtreplay' % index, 'title': u'Бой %d' % index, 'size': 1500000 + index,
              'time': 1790507100 - index * 600, 'map_title': u'Прохоровка', 'map_image': 'img://gui/maps/icons/map/stats/05_prohorovka.png',
              'tank': u'Т-34', 'tank_image': 'img://gui/maps/icons/vehicle/ussr-R04_T-34.png', 'damage': 2150, 'xp': 1150, 'favourite': False,
              'site': None, 'playable': True}
    replay.update(values)
    return replay


def page(items, status='ready', done=ITEMS):
    return {'kind': 'replays', 'status': status, 'progress': {'done': done, 'total': ITEMS}, 'client': '1.45.0.0', 'folder': 'C:/replays',
            'upload': 'ready', 'items': items}


def apply(held, message):
    """The page's side (ui-web applyFeed), for the round trip: a snapshot replaces, a delta on the held base patches."""
    if message['base'] is None:
        return {'rev': message['rev'], 'page': message['page'], 'items': list(message['items'])}
    assert held is not None and held['rev'] == message['base']
    removed = set(message['del'])
    items = dict((entry['id'], entry) for entry in held['items'] if entry['id'] not in removed)
    order = [entry['id'] for entry in held['items'] if entry['id'] not in removed]
    for entry in message['set']:
        if entry['id'] not in items:
            order.append(entry['id'])
        items[entry['id']] = entry
    return {'rev': message['rev'], 'page': message['page'], 'items': [items[key] for key in order]}


class FeedTest(unittest.TestCase):

    def setUp(self):
        self.items = [item(index) for index in range(ITEMS)]
        self.feed = Feed('replay_manager')

    def test_split_page(self):
        meta, items = split_page(page(self.items[:2]))
        assert 'items' not in meta and meta['status'] == 'ready' and [entry['id'] for entry in items] == [self.items[0]['id'], self.items[1]['id']]
        assert split_page(None) == (None, [])
        assert split_page({'kind': 'replays', 'items': [{'title': 'no id'}, 'x']}) == ({'kind': 'replays'}, [])

    def test_a_snapshot_then_only_what_changed(self):
        first = self.feed.message(page(self.items), 0.0)
        assert first['base'] is None and first['rev'] == 1 and len(first['items']) == ITEMS and 'items' not in first['page']
        assert self.feed.message(page(self.items), 5.0) is None
        changed = list(self.items)
        changed[3] = item(3, favourite=True)
        changed.append(item(ITEMS, title='new'))
        del changed[10]
        delta = self.feed.message(page(changed), 10.0)
        assert delta['base'] == 1 and delta['rev'] == 2
        assert [entry['id'] for entry in delta['set']] == [changed[3]['id'], item(ITEMS)['id']]
        assert delta['del'] == [self.items[10]['id']]

    def test_the_page_alone_changes(self):
        self.feed.message(page(self.items, status='indexing', done=10), 0.0)
        delta = self.feed.message(page(self.items), 3.0)
        assert delta['set'] == [] and delta['del'] == [] and delta['page']['status'] == 'ready'

    def test_deltas_rebuild_the_page(self):
        held = apply(None, self.feed.message(page(self.items[:600], status='indexing', done=600), 0.0))
        steps = [self.items[:900], self.items[:900], [item(0, favourite=True)] + self.items[1:900], self.items[1:ITEMS], []]
        for number, items in enumerate(steps):
            message = self.feed.message(page(items), 3.0 * (number + 1))
            if message is not None:
                held = apply(held, message)
            assert sorted(entry['id'] for entry in held['items']) == sorted(entry['id'] for entry in items)
            assert dict((entry['id'], entry) for entry in held['items']) == dict((entry['id'], entry) for entry in items)
        assert held['page']['status'] == 'ready'

    def test_a_reset_sends_a_snapshot_with_a_newer_revision(self):
        self.feed.message(page(self.items), 0.0)
        self.feed.reset()
        again = self.feed.message(page(self.items), 1.0)
        assert again['base'] is None and again['rev'] == 2 and len(again['items']) == ITEMS

    def test_no_page(self):
        first = self.feed.message(None, 0.0)
        assert first['page'] is None and first['items'] == []
        assert self.feed.message(None, 3.0) is None
        assert self.feed.message(page(self.items[:1]), 6.0)['set'] == self.items[:1]

    def test_polls_are_throttled_forced_reads_are_not(self):
        assert self.feed.due(0.0)
        self.feed.message(page(self.items), 0.0)
        assert not self.feed.due(FEED_INTERVAL_S - 0.1)
        assert self.feed.due(FEED_INTERVAL_S - 0.1, force=True)
        assert self.feed.due(FEED_INTERVAL_S)
        self.feed.reset()
        assert self.feed.due(0.5)

    def test_message_sizes(self):
        snapshot = encode_feed(self.feed.message(page(self.items), 0.0))
        assert json.loads(snapshot)['v'] == PROTOCOL_VERSION
        changed = list(self.items)
        changed[5] = item(5, favourite=True)
        delta = encode_feed(self.feed.message(page(changed), 3.0))
        progress = encode_feed(self.feed.message(page(changed, status='indexing', done=999), 6.0))
        assert len(snapshot) > 300 * 1024
        assert len(delta) < 1024 and len(progress) < 512


if __name__ == '__main__':
    unittest.main()
