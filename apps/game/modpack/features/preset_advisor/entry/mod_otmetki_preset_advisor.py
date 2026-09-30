from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.preset_advisor import register
    register()
except Exception:
    print('[OTMETKI] failed to register preset_advisor\n%s' % traceback.format_exc())
