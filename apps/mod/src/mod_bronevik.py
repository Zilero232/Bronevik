from __future__ import absolute_import, print_function

import traceback

try:
    from gui.mods.bronevik.client.app import start
    start()
except Exception:
    print('[BRONEVIK] failed to start\n%s' % traceback.format_exc())
