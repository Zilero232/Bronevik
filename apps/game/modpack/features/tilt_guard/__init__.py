from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'tilt_guard'
PACKAGE_ID = 'net.triotmetki.tilt_guard'
PACKAGE_NAME = 'Three Marks: tilt guard'
VERSION = '0.1.0'


def create(app):
    from .client import TiltGuard
    return TiltGuard(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
