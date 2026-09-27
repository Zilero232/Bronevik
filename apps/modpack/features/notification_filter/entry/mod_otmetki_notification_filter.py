from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.notification_filter import register
    register()
except Exception:
    print('[OTMETKI] failed to register notification_filter\n%s' % traceback.format_exc())
