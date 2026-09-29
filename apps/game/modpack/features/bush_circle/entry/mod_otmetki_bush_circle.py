from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.bush_circle import register
    register()
except Exception:
    print('[OTMETKI] failed to register bush_circle\n%s' % traceback.format_exc())
