from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'battle_hits'
PACKAGE_ID = 'net.triotmetki.battle_hits'
PACKAGE_NAME = 'Three Marks: battle wounds'
VERSION = '0.1.0'


def create(app):
    from .client import BattleHitsFeature
    return BattleHitsFeature(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
