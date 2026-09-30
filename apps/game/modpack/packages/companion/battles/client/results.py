from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld

from ....core.client.game import client_attr, service

# RU 1.45 client source: the results of a battle the player left early reach the lobby only through the
# game's own request (gui/battle_results/service.py requestResults, on the lobby load or the notification
# click). That request stores them in the on-disk cache (client_common/shared_utils/account_helpers/
# BattleResultsCache.py save) and then fires IBattleResultsService.onResultPosted. The mod never calls
# BattleResultsCache.get: it sends CMD_REQ_BATTLE_RESULTS, and while it waits the game's own window gets
# RES_COOLDOWN ("results unavailable"). Reading the file back with BattleResultsCache.load sends nothing.
SERVICE_MODULE = 'skeletons.gui.battle_results'
SERVICE_NAME = 'IBattleResultsService'
POSTED_EVENT = 'onResultPosted'


def cached_results(arena_id):
    name = getattr(BigWorld.player(), 'name', None)
    if not name or not arena_id:
        return None
    try:
        from account_helpers import BattleResultsCache
        compact = BattleResultsCache.load(name, arena_id)
        return BattleResultsCache.convertToFullForm(compact) if compact else None
    except Exception:
        return None


def results_service():
    return service(client_attr(SERVICE_MODULE, SERVICE_NAME))


def posted_arena_id(reusable_info):
    return getattr(reusable_info, 'arenaUniqueID', None)
