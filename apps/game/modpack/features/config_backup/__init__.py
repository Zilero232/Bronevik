from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'config_backup'
PACKAGE_ID = 'net.triotmetki.config_backup'
PACKAGE_NAME = 'Three Marks: config backup'
VERSION = '0.1.0'


def create(app):
    from .client import ConfigBackup
    return ConfigBackup(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
