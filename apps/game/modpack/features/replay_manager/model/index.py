from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import string_types, to_text
from .constants import INDEX_MAX


class UploadedIndex(object):

    def __init__(self, store):
        self.store = store
        data = store.read({})
        items = data.get('uploaded') if isinstance(data, dict) else None
        self.items = [(to_text(a), to_text(r)) for a, r in (items or []) if isinstance(a, string_types) and isinstance(r, string_types)]

    def add(self, arena_unique_id, replay_id):
        if not arena_unique_id or not isinstance(replay_id, string_types) or not replay_id:
            return False
        arena_unique_id = to_text(arena_unique_id)
        self.items = [item for item in self.items if item[0] != arena_unique_id] + [(arena_unique_id, to_text(replay_id))]
        self.items = self.items[-INDEX_MAX:]
        self.store.write({'uploaded': [list(item) for item in self.items]})
        return True

    def get(self, arena_unique_id):
        for arena, replay_id in self.items:
            if arena == arena_unique_id:
                return replay_id
        return None
