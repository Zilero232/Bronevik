from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.hangar_marks import register
    register()
except Exception:
    print('[OTMETKI] failed to register hangar_marks\n%s' % traceback.format_exc())
