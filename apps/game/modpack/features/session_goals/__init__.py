from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'session_goals'
PACKAGE_ID = 'net.triotmetki.session_goals'
PACKAGE_NAME = 'Three Marks: session goals'
VERSION = '0.2.0'


def create(app):
    from .client import SessionGoals
    return SessionGoals(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
