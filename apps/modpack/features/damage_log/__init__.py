"""Feature: battle damage log panel (dealt / blocked / assisted / received). Depends on the core and the companion."""
from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'damage_log'
PACKAGE_ID = 'net.triotmetki.damage_log'
PACKAGE_NAME = 'Three Marks: damage log'
VERSION = '0.1.0'


def create(app):
    from .client import DamageLogPanel
    return DamageLogPanel(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
