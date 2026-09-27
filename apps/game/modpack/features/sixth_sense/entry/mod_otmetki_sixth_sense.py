from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.sixth_sense import register
    register()
except Exception:
    print('[OTMETKI] failed to register sixth_sense\n%s' % traceback.format_exc())
