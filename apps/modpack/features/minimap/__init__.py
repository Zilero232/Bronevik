"""Feature: minimap options the client supports, from the in-game window. Depends on the core and the companion."""
from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'minimap'
PACKAGE_ID = 'net.triotmetki.minimap'
PACKAGE_NAME = 'Three Marks: minimap'
VERSION = '0.1.0'


def create(app):
    from .client import create_minimap
    return create_minimap(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
