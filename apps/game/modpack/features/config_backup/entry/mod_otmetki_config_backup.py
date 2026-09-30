from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.config_backup import register
    register()
except Exception:
    print('[OTMETKI] failed to register config_backup\n%s' % traceback.format_exc())
