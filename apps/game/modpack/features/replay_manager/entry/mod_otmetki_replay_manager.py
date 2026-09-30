from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.replay_manager import boot, register
    register()
    boot()
except Exception:
    print('[OTMETKI] failed to register replay_manager\n%s' % traceback.format_exc())
