from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.reload_timer import register
    register()
except Exception:
    print('[OTMETKI] failed to register reload_timer\n%s' % traceback.format_exc())
