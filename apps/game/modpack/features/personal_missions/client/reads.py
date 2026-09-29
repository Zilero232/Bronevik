from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import call
from ....core.client.game import client_attr, service
from ....core.log import log_exception
from .constants import (CLASS_ALIAS, CONDITIONS_ATTR, CONDITIONS_MODULE, CONDITIONS_SEPARATOR, EVENTS_CACHE_ATTR, EVENTS_CACHE_MODULE, I18N_MODULE,
                        KEY_DESCRIPTION)

# RU 1.45 client source: IEventsCache.getPersonalMissions().getAllQuests() -> {id: PersonalMission}
# (gui/server_events/event_items.py) with getUserName(), getUserDescription() (a #personal_missions_details key, the
# mission's flavour text), getQuestClassifier().getAllClassificationAttrs() (common/pm_quests.py: 'vehType' is the
# class tag, other classifiers an alliance or a level group), getVehMinLevel()/getVehMaxLevel(), isInProgress(),
# isCompleted(), isMainCompleted(), isFullCompleted(). The main and 'with honours' conditions are the lines the missions
# map tooltip shows: gui/server_events/personal_progress/formatters.PMTooltipConditionsFormatters().format(quest, isMain)
# -> [(icon, title, isInOrGroup)].


def _state(quest):
    if call(quest, 'isFullCompleted', False):
        return 'honors'
    if call(quest, 'isCompleted', False) or call(quest, 'isMainCompleted', False):
        return 'done'
    if call(quest, 'isInProgress', False):
        return 'in_progress'
    return None


def _classes(quest):
    attrs = call(call(quest, 'getQuestClassifier'), 'getAllClassificationAttrs', {}) or {}
    tag = attrs.get(CLASS_ALIAS) if isinstance(attrs, dict) else None
    return [tag] if tag else []


def _levels(quest):
    return [call(quest, 'getVehMinLevel'), call(quest, 'getVehMaxLevel')]


def _conditions(formatter, quest, is_main):
    titles = [getattr(item, 'title', None) for item in (call(formatter, 'format', [], quest, is_main) or [])]
    return CONDITIONS_SEPARATOR.join(title for title in titles if title)


def _text(key):
    """A #personal_missions_details key as the missions tooltip resolves it (gui/shared/tooltips/personal_missions.py)."""
    exists = client_attr(I18N_MODULE, 'doesTextExist')
    make = client_attr(I18N_MODULE, 'makeString')
    if not key or exists is None or make is None:
        return None
    for candidate in (key, KEY_DESCRIPTION % key):
        if exists(candidate):
            return make(candidate)
    return None


def own_missions():
    """The missions the client lists for the player, as plain dicts (model.clean_missions checks them)."""
    cache = service(client_attr(EVENTS_CACHE_MODULE, EVENTS_CACHE_ATTR))
    personal = call(cache, 'getPersonalMissions')
    quests = call(personal, 'getAllQuests', {}) or {}
    formatter_class = client_attr(CONDITIONS_MODULE, CONDITIONS_ATTR)
    formatter = formatter_class() if formatter_class is not None else None
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
        # The conditions are built per mission from its config: only for the ones in progress, what the labels show.
        active = state == 'in_progress'
        missions.append({
            'id': quest_id,
            'name': call(quest, 'getUserName', None),
            'main': (_conditions(formatter, quest, True) or _text(call(quest, 'getUserDescription', None))) if active else None,
            'extra': _conditions(formatter, quest, False) if active else None,
            'state': state,
            'classes': _classes(quest),
            'levels': _levels(quest),
        })
    return missions
