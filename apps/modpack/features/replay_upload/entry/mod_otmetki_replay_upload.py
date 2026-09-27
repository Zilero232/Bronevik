from __future__ import absolute_import, print_function

import traceback

try:
    from gui.mods.otmetki.features.replay_upload import register
    register()
except Exception:
    print('[OTMETKI] failed to register replay_upload\n%s' % traceback.format_exc())
