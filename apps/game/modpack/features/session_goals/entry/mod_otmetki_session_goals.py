from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.session_goals import register
    register()
except Exception:
    print('[OTMETKI] failed to register session_goals\n%s' % traceback.format_exc())
