from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'battle_efficiency'
PACKAGE_ID = 'net.triotmetki.battle_efficiency'
PACKAGE_NAME = 'Three Marks: battle efficiency'
VERSION = '0.2.0'


def create(app):
    from .client import BattleEfficiencyPanel
    return BattleEfficiencyPanel(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
