from __future__ import absolute_import, division, print_function, unicode_literals

import traceback

try:
    from gui.mods.otmetki.features.team_hp import register
    register()
except Exception:
    print('[OTMETKI] failed to register team_hp\n%s' % traceback.format_exc())
