from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.tilt_guard import register
    register()
except Exception:
    print('[OTMETKI] failed to register tilt_guard\n%s' % traceback.format_exc())
