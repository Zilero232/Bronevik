"""Feature: sixth sense alert (custom sound and icon when the client lamp lights). Depends on the core and the companion."""
from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'sixth_sense'
PACKAGE_ID = 'net.triotmetki.sixth_sense'
PACKAGE_NAME = 'Three Marks: sixth sense'
VERSION = '0.1.0'


def create(app):
    from .client import SixthSenseAlert
    return SixthSenseAlert(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
