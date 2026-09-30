# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.hud.widget import widget
from .armor import armor_value, verdict_tone
from .constants import DEGREES, KIND


def _shown(readout, settings, key, switch):
    value = readout[key]
    return u'%d' % value if settings.get(switch) and value is not None else u''


def armor_widget(readout, settings, translate):
    if readout is None:
        return None
    return widget(KIND, {
        'value': armor_value(readout, translate),
        'tone': verdict_tone(readout),
        'ricochet': bool(readout['ricochet']),
        'nominal': _shown(readout, settings, 'nominal', 'show_nominal'),
        'piercing': _shown(readout, settings, 'piercing', 'show_piercing'),
        'angle': DEGREES % readout['angle'] if settings.get('show_angle') and readout['angle'] is not None else u'',
        'unit': translate('aim_info_mm'),
        'piercing_label': translate('aim_info_piercing_label'),
    })
