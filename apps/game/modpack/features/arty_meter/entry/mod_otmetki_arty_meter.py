from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.arty_meter import register
    register()
except Exception:
    print('[OTMETKI] failed to register arty_meter\n%s' % traceback.format_exc())
