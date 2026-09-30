from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'marks_history'
PACKAGE_ID = 'net.triotmetki.marks_history'
PACKAGE_NAME = 'Three Marks: marks history'
VERSION = '0.3.0'


def create(app):
    from .client import MarksHistoryFeature
    return MarksHistoryFeature(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
