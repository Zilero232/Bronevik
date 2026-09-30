from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'main_gun'
PACKAGE_ID = 'net.triotmetki.main_gun'
PACKAGE_NAME = 'Three Marks: High Caliber counter'
VERSION = '0.3.0'


def create(app):
    from .client import MainGunPanel
    return MainGunPanel(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
