from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'battle_sounds'
PACKAGE_ID = 'net.triotmetki.battle_sounds'
PACKAGE_NAME = 'Three Marks: battle sounds'
VERSION = '0.1.0'


def create(app):
    from .client import BattleSounds
    return BattleSounds(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
