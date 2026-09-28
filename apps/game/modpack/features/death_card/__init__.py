from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'death_card'
PACKAGE_ID = 'net.triotmetki.death_card'
PACKAGE_NAME = 'Three Marks: death card'
VERSION = '0.1.0'


def create(app):
    from .client import DeathCardPanel
    return DeathCardPanel(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
