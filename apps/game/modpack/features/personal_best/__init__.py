from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'personal_best'
PACKAGE_ID = 'net.triotmetki.personal_best'
PACKAGE_NAME = 'Three Marks: personal best'
VERSION = '0.2.1'


def create(app):
    from .client import PersonalBestPanel
    return PersonalBestPanel(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
