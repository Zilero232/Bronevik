from __future__ import absolute_import, division, print_function, unicode_literals

UI_ID = 'ui'


def create(app):
    from .client import UiHost
    return UiHost(app)


def register():
    from ..core.registry import registry
    return registry().register(UI_ID, create)
