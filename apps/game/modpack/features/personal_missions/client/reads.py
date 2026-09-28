from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import call
from ....core.client.game import client_attr, service
from ....core.log import log_exception
from .constants import EVENTS_CACHE_ATTR, EVENTS_CACHE_MODULE

# RU 1.45 client source (gui/server_events/event_items.py PersonalMission, gui/server_events/events_cache.py):
# IEventsCache.getPersonalMissions().getAllQuests() -> {id: PersonalMission} with getUserName(), getUserMainCondition(),
# getUserAddCondition(), isInProgress(), isCompleted(), isFullCompleted() and getVehicleClasses(); what the missions
# screen shows. UNVERIFIED on Lesta 1.45: the names of these getters after the personal missions 2.0 rework.


def _state(quest):
    if call(quest, 'isFullCompleted', False):
        return 'honors'
    if call(quest, 'isCompleted', False) or call(quest, 'isMainCompleted', False):
        return 'done'
    if call(quest, 'isInProgress', False):
        return 'in_progress'
    return None


def _classes(quest):
    value = call(quest, 'getVehicleClasses', None)
    try:
        return list(value or [])
    except TypeError:
        return []


def own_missions():
    """The missions the client lists for the player, as plain dicts (model.clean_missions checks them)."""
    cache = service(client_attr(EVENTS_CACHE_MODULE, EVENTS_CACHE_ATTR))
    personal = call(cache, 'getPersonalMissions')
    quests = call(personal, 'getAllQuests', {}) or {}
    missions = []
    try:
        items = list(quests.items()) if hasattr(quests, 'items') else []
    except Exception:
        log_exception('personal missions: read')
        return []
    for quest_id, quest in items:
        state = _state(quest)
        if state is None:
            continue
        missions.append({
            'id': quest_id,
            'name': call(quest, 'getUserName', None),
            'main': call(quest, 'getUserMainCondition', None),
            'extra': call(quest, 'getUserAddCondition', None),
            'state': state,
            'classes': _classes(quest),
        })
    return missions
