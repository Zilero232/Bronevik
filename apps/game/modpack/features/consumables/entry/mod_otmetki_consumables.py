from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.consumables import register
    register()
except Exception:
    print('[OTMETKI] failed to register consumables\n%s' % traceback.format_exc())
