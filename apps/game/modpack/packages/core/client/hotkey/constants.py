from __future__ import absolute_import, division, print_function, unicode_literals

# A modifier named by its left-hand key is held on either side, as the client's own checks read Shift and Ctrl
# (BigWorld.isKeyDown(Keys.KEY_LSHIFT) or BigWorld.isKeyDown(Keys.KEY_RSHIFT), RU 1.45 source).
EITHER_SIDE = {
    'KEY_LCONTROL': 'KEY_RCONTROL',
    'KEY_LSHIFT': 'KEY_RSHIFT',
    'KEY_LALT': 'KEY_RALT',
}
