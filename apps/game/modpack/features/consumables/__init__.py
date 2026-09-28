from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'consumables'
PACKAGE_ID = 'net.triotmetki.consumables'
PACKAGE_NAME = 'Three Marks: consumables'
VERSION = '0.1.0'


def create(app):
    from .client import ConsumablesPanel
    return ConsumablesPanel(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
