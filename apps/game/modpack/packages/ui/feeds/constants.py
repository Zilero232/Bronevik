from __future__ import absolute_import, division, print_function, unicode_literals

# A watched feed is read again at most this often on the app's tick (the replays page while headers are read, an
# upload or an analysis coming back); the player's own messages send at once.
FEED_INTERVAL_S = 3.0
ITEMS_KEY = 'items'
ITEM_ID = 'id'
