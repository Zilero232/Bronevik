from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.marks_history import register
    register()
except Exception:
    print('[OTMETKI] failed to register marks_history\n%s' % traceback.format_exc())
