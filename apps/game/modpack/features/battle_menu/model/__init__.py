from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.surface import KIND_BUTTON

# Fair play: a button that opens the mod's own settings window; it reads nothing about the battle.


# The HUD page's button panel: fixed (never dragged, so it is clickable while the battle cursor is out) and centred
# with the stock menu, the player's offset from its centre in x/y.
def button_props(settings, hint):
    return {
        'text': u'',
        'kind': KIND_BUTTON,
        'x': settings.get('x'),
        'y': settings.get('y'),
        'alignX': 'center',
        'alignY': 'center',
        'scale': round(settings.get('scale') / 100.0, 2),
        'drag': False,
        'border': False,
        'visible': True,
        'hint': hint,
    }
