from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.native import NativeSettingsComponent
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import to_native
from ..settings import SCHEMA, SWITCH


def create_crosshair(app):
    return NativeSettingsComponent(app, FEATURE_ID, SCHEMA, SWITCH, STRINGS, to_native)
