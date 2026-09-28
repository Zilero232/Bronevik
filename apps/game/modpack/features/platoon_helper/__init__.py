from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'platoon_helper'
PACKAGE_ID = 'net.triotmetki.platoon_helper'
PACKAGE_NAME = 'Three Marks: platoon helper'
VERSION = '0.1.0'


def create(app):
    from .client import PlatoonHelper
    return PlatoonHelper(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
