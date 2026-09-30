from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.hangar_space import register
    register()
except Exception:
    print('[OTMETKI] failed to register hangar_space\n%s' % traceback.format_exc())
