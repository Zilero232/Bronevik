from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'hangar_ratings'
PACKAGE_ID = 'net.triotmetki.hangar_ratings'
PACKAGE_NAME = 'Three Marks: hangar ratings'
VERSION = '0.1.1'


def create(app):
    from .client import HangarRatings
    return HangarRatings(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
