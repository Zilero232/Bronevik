from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'hit_log'
PACKAGE_ID = 'net.triotmetki.hit_log'
PACKAGE_NAME = 'Three Marks: hit log'
VERSION = '0.2.1'


def create(app):
    from .client import HitLogPanel
    return HitLogPanel(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
