from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.crosshair import register
    register()
except Exception:
    print('[OTMETKI] failed to register crosshair\n%s' % traceback.format_exc())
