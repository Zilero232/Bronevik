from __future__ import absolute_import, division, print_function, unicode_literals

# The payload version of a widget; the page drops a widget whose kind or version it does not know and draws `text`.
WIDGET_VERSION = 1

# Colour roles the page maps to its palette (docs/specs/2026-09-29-hud-visual-redesign.md section 4.4).
TONES = ('text', 'muted', 'ally', 'enemy', 'gold', 'accent', 'radio', 'track', 'stun', 'blocked', 'received', 'success', 'warning', 'good',
         'bad')
