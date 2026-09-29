from __future__ import absolute_import, division, print_function, unicode_literals

DEFAULT_MODIFIER = 'alt'

# The keys a panel edit modifier needs held: every group, any key of a group (left or right). Ctrl+Alt is the
# fallback when Alt alone clashes with the client; in battle the cursor itself needs Ctrl, so `ctrl` moves
# panels with the cursor key alone.
MODIFIERS = {
    'alt': (('KEY_LALT', 'KEY_RALT'),),
    'ctrl_alt': (('KEY_LCONTROL', 'KEY_RCONTROL'), ('KEY_LALT', 'KEY_RALT')),
    'ctrl': (('KEY_LCONTROL', 'KEY_RCONTROL'),),
    'shift': (('KEY_LSHIFT', 'KEY_RSHIFT'),),
}
MODIFIER_CHOICES = ('alt', 'ctrl_alt', 'ctrl', 'shift')
