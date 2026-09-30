from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.comp7_helper import register
    register()
except Exception:
    print('[OTMETKI] failed to register comp7_helper\n%s' % traceback.format_exc())
