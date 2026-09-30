from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'arty_meter'
PACKAGE_ID = 'net.triotmetki.arty_meter'
PACKAGE_NAME = 'Three Marks: artillery meter'
VERSION = '0.1.1'


def create(app):
    from .client import ArtyMeterPanel
    return ArtyMeterPanel(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
