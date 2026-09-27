"""Feature: hangar replay manager (own replays in the client folder; the uploaded ones link to the site).
Depends on the core and the companion; the ui package shows its page."""
from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'replay_manager'
PACKAGE_ID = 'net.triotmetki.replay_manager'
PACKAGE_NAME = 'Three Marks: replay manager'
VERSION = '0.1.0'


def create(app):
    from .client import ReplayManager
    return ReplayManager(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
