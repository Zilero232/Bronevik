from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'received_hits'
PACKAGE_ID = 'net.triotmetki.received_hits'
PACKAGE_NAME = 'Three Marks: hits received'
VERSION = '0.2.1'


def create(app):
    from .client import ReceivedHitsPanel
    return ReceivedHitsPanel(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
