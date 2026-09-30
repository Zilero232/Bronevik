from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import FEED_INTERVAL_S, ITEM_ID, ITEMS_KEY


def split_page(page):
    """(the page without its items, the items) of a page dict; (None, []) for no page."""
    if not isinstance(page, dict):
        return None, []
    meta = dict((key, value) for key, value in page.items() if key != ITEMS_KEY)
    items = [item for item in page.get(ITEMS_KEY) or () if isinstance(item, dict) and item.get(ITEM_ID) is not None]
    return meta, items


class Feed(object):
    """A large page sent apart from the settings state: a snapshot first, then only what changed (the page's own keys
    and the items added, changed or removed, by `id`). Every message carries its revision and the one it builds on
    (`base`, None for a snapshot); the page asks for a new snapshot when it does not hold that base."""

    def __init__(self, component_id, interval_s=FEED_INTERVAL_S):
        self.component = component_id
        self.interval_s = interval_s
        self.rev = 0
        self.synced = False
        self.checked_at = None
        self.meta = None
        self.items = {}

    def reset(self):
        """The next message is a snapshot (a new page, or one that lost track)."""
        self.synced = False
        self.meta, self.items = None, {}

    def due(self, now, force=False):
        return force or not self.synced or self.checked_at is None or now - self.checked_at >= self.interval_s

    def message(self, page, now):
        """The message for the page as it is now, or None when nothing changed since the last one."""
        self.checked_at = now
        meta, items = split_page(page)
        base = self.rev if self.synced else None
        known = self.items
        self.items = dict((item[ITEM_ID], item) for item in items)
        if base is None:
            self.synced, self.meta = True, meta
            self.rev += 1
            return {'feed': self.component, 'rev': self.rev, 'base': None, 'page': meta, 'items': items}
        changed = [item for item in items if not _same(known.get(item[ITEM_ID]), item)]
        removed = sorted(key for key in known if key not in self.items)
        if not changed and not removed and meta == self.meta:
            return None
        self.meta = meta
        self.rev += 1
        return {'feed': self.component, 'rev': self.rev, 'base': base, 'page': meta, 'set': changed, 'del': removed}


def _same(old, new):
    return old is new or (old is not None and old == new)
