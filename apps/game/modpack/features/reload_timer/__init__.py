from __future__ import absolute_import, division, print_function, unicode_literals

FEATURE_ID = 'reload_timer'
PACKAGE_ID = 'net.triotmetki.reload_timer'
PACKAGE_NAME = 'Three Marks: reload timer'
VERSION = '0.2.1'


def create(app):
    from .client import ReloadTimerPanel
    return ReloadTimerPanel(app)


def register():
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
