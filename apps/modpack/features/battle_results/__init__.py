"""Feature: extended post-battle summary in hangar notifications. Depends on the core and the companion."""
from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'battle_results'
PACKAGE_ID = 'net.triotmetki.battle_results'
PACKAGE_NAME = 'Three Marks: battle results'
VERSION = '0.1.0'


def create(app):
    from .client import BattleResultsSummary
    return BattleResultsSummary(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
