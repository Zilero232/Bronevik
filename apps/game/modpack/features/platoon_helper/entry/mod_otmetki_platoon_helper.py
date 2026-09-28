from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.platoon_helper import register
    register()
except Exception:
    print('[OTMETKI] failed to register platoon_helper\n%s' % traceback.format_exc())
