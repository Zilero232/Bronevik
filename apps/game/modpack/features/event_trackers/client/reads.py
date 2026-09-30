from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ....core.client.game import client_attr, service
from ....core.compat import call, to_text
from ....core.log import log_exception
from ..model.constants import CARAVAN_ENTITLEMENT, CLEAN_XP_OBJECTIVE

# RU 1.45 client source:
# - gui/event_boards (IEventBoardController, skeletons/gui/event_boards_controllers.py): the competitions the missions page
#   lists, loaded at login (gui/shared/personality.py: getEvents(onlySettings=True)); an EventSettings gives getName,
#   getObjectiveParameter ('originalXP' for a clean-XP one), getCardinality (the best battles counted), isStarted,
#   isFinished, getStartDateTs, getEndDateTs and getLimits().getVehiclesLevels(). UNVERIFIED on Lesta 1.45: that Triathlon
#   is listed there (its entry point is a hangar flag, as the event boards' HangarFlagData).
# - gui/game_control/shop_sales_event_controller.py (IShopSalesEventController): the Trading Caravan's hangar entry point,
#   isShopSalesEntryPointAvailable() while the event runs, activePhaseFinishTime / eventFinishTime; the token count is the
#   account entitlement the caravan page reads (web/web_client_api/trading_caravan: itemsCache.items.stats.entitlements).


def _min_tier(event):
    levels = call(call(event, 'getLimits'), 'getVehiclesLevels') or ()
    levels = [level for level in levels if isinstance(level, int)]
    return min(levels) if levels else None


def triathlon_event():
    """The clean-XP competition the client lists as running, or None."""
    try:
        controller = service(client_attr('skeletons.gui.event_boards_controllers', 'IEventBoardController'))
        settings = call(controller, 'getEventsSettingsData')
        for event in call(settings, 'getEvents', ()) or ():
            if call(event, 'getObjectiveParameter') != CLEAN_XP_OBJECTIVE:
                continue
            if not call(event, 'isStarted', False) or call(event, 'isFinished', True):
                continue
            name = call(event, 'getName')
            return {'name': to_text(name) if name else None, 'cardinality': call(event, 'getCardinality'), 'start': call(event, 'getStartDateTs'),
                    'end': call(event, 'getEndDateTs'), 'min_tier': _min_tier(event)}
    except Exception:
        log_exception('event trackers: competitions')
    return None


def caravan():
    """The own Trading Caravan tokens and the event's end, or None outside the event."""
    try:
        controller = service(client_attr('skeletons.gui.game_control', 'IShopSalesEventController'))
        if controller is None or not call(controller, 'isShopSalesEntryPointAvailable', False):
            return None
        items = service(client_attr('skeletons.gui.shared', 'IItemsCache'))
        entitlements = getattr(getattr(getattr(items, 'items', None), 'stats', None), 'entitlements', None) or {}
        active_until = getattr(controller, 'activePhaseFinishTime', 0) or 0
        finish = active_until if active_until > time.time() else getattr(controller, 'eventFinishTime', 0)
        return {'coins': entitlements.get(CARAVAN_ENTITLEMENT, 0), 'finish': finish}
    except Exception:
        log_exception('event trackers: caravan')
        return None
