from __future__ import absolute_import, division, print_function, unicode_literals

# The hotkey choices: (Keys name, held modifiers). Ctrl+Shift+H by default: no game command uses it.
HOTKEYS = {
    'none': (None, ()),
    'ctrl_shift_h': ('KEY_H', ('KEY_LCONTROL', 'KEY_LSHIFT')),
    'ctrl_shift_s': ('KEY_S', ('KEY_LCONTROL', 'KEY_LSHIFT')),
    'f9': ('KEY_F9', ()),
    'f10': ('KEY_F10', ()),
    'f11': ('KEY_F11', ()),
}
HOTKEY_CHOICES = ('ctrl_shift_h', 'ctrl_shift_s', 'f9', 'f10', 'f11', 'none')

# The hangar labels with the player's own numbers (ratings, session, goals, missions, marks history) that a private
# stream keeps off the screen.
PRIVATE_HANGAR_LABELS = (
    'otmetki.hangar_ratings',
    'otmetki.session',
    'otmetki.session_goals',
    'otmetki.personal_missions',
    'otmetki.marks_history',
)
