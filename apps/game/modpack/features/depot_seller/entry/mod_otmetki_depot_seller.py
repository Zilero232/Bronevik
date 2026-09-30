from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.depot_seller import register
    register()
except Exception:
    print('[OTMETKI] failed to register depot_seller\n%s' % traceback.format_exc())
