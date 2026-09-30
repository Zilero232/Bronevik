from __future__ import absolute_import, division, print_function, unicode_literals


def game_input_manager():
    try:
        from helpers import dependency
        from skeletons.gui.app_loader import IAppLoader
    except ImportError:
        return None
    app = dependency.instance(IAppLoader).getApp()
    return getattr(app, 'gameInputManager', None)
