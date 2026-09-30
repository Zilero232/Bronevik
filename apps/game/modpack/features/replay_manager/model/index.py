from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import string_types, to_text
from .constants import FAVOURITES_MAX, INDEX_MAX


class UploadedIndex(object):
    """One account's replay marks: the site id of each uploaded battle (by arena) and the favourites (by arena, or by
    file name for a replay without one)."""

    def __init__(self, store):
        self.store = store
        data = store.read({})
        data = data if isinstance(data, dict) else {}
        items = data.get('uploaded') if isinstance(data.get('uploaded'), list) else []
        self.items = [(to_text(a), to_text(r)) for a, r in (item for item in items if isinstance(item, list) and len(item) == 2)
                      if isinstance(a, string_types) and isinstance(r, string_types)]
        favourites = data.get('favourites') if isinstance(data.get('favourites'), list) else []
        self.favourites = [to_text(key) for key in favourites if isinstance(key, string_types) and key][-FAVOURITES_MAX:]

    def _persist(self):
        self.store.write({'uploaded': [list(item) for item in self.items], 'favourites': list(self.favourites)})

    def add(self, arena_unique_id, replay_id):
        if not arena_unique_id or not isinstance(replay_id, string_types) or not replay_id:
            return False
        arena_unique_id = to_text(arena_unique_id)
        self.items = [item for item in self.items if item[0] != arena_unique_id] + [(arena_unique_id, to_text(replay_id))]
        self.items = self.items[-INDEX_MAX:]
        self._persist()
        return True

    def get(self, arena_unique_id):
        for arena, replay_id in self.items:
            if arena == arena_unique_id:
                return replay_id
        return None

    def is_favourite(self, key):
        return bool(key) and to_text(key) in self.favourites

    def set_favourite(self, key, on):
        if not key:
            return False
        key = to_text(key)
        if on == (key in self.favourites):
            return False
        self.favourites = [item for item in self.favourites if item != key] + ([key] if on else [])
        self.favourites = self.favourites[-FAVOURITES_MAX:]
        self._persist()
        return True

    def moved(self, old_key, new_key):
        if old_key != new_key and self.is_favourite(old_key):
            self.favourites = [new_key if item == old_key else item for item in self.favourites]
            self._persist()
