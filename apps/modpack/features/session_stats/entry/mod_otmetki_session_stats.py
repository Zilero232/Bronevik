from __future__ import absolute_import, print_function

import traceback

try:
    from gui.mods.otmetki.features.session_stats import register
    register()
except Exception:
    print('[OTMETKI] failed to register session_stats\n%s' % traceback.format_exc())
