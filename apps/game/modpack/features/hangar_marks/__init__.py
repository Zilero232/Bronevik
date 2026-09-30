from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'hangar_marks'
PACKAGE_ID = 'net.triotmetki.hangar_marks'
PACKAGE_NAME = 'Three Marks: hangar marks'
VERSION = '0.2.0'


def create(app):
    from .client import HangarMarks
    return HangarMarks(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
