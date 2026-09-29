from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.icons import image
from ....core.hud.widget import widget
from .constants import KIND

# Fair play: the player's own tank only, what its equipment, field modification and directive slots show in the hangar.


def item(entry):
    return {'icon': image(entry['icon']) if entry.get('icon') else None, 'name': entry['name'], 'bonus': bool(entry.get('bonus'))}


def loadout_widget(loadout, settings):
    groups = []
    if settings.get('show_devices') and loadout['devices']:
        groups.append({'kind': 'devices', 'items': [item(entry) for entry in loadout['devices']]})
    if settings.get('show_modifications') and loadout['modifications']:
        groups.append({'kind': 'modifications', 'items': [{'icon': None, 'name': name, 'bonus': False} for name in loadout['modifications']]})
    if settings.get('show_directives') and loadout['directives']:
        groups.append({'kind': 'directives', 'items': [item(entry) for entry in loadout['directives']]})
    return widget(KIND, {'compact': settings.get('style') == 'compact', 'size': settings.get('icon_size'), 'groups': groups})
