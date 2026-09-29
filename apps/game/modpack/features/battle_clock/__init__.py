from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'battle_clock'
PACKAGE_ID = 'net.triotmetki.battle_clock'
PACKAGE_NAME = 'Three Marks: battle clock'
VERSION = '0.2.0'


def create(app):
    from .client import BattleClockPanel
    return BattleClockPanel(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
