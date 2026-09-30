from __future__ import absolute_import, division, print_function, unicode_literals

# The settings page draws its own centred box over the client's blur, so the window covers the client: the flags and
# layer of the client's own full-screen Gameface page over the hangar (RU 1.45 client source,
# personal_missions_window_events: `WindowFlags.WINDOW | WindowFlags.WINDOW_FULLSCREEN`, `WindowLayer.OVERLAY`).
# A plain WINDOW sized to a page whose root is `100%` stayed 0x0 and invisible in the 1.45.0.0 live test.
WINDOW_LAYER = 'OVERLAY'
