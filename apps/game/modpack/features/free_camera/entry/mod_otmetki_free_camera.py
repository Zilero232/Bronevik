from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.free_camera import register
    register()
except Exception:
    print('[OTMETKI] failed to register free_camera\n%s' % traceback.format_exc())
