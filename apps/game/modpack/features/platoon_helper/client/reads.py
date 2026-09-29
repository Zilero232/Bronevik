from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.battle import call
from ....core.log import log_exception

# RU 1.45 client source (gui/prb_control): g_prbLoader.getDispatcher().getEntity() is the platoon the player is in;
# UnitEntity.getPlayers() -> {dbID: PlayerUnitInfo} (entities/base/unit/entity.py:620) with `name`, the `isReady` slot and
# isCurrentPlayer() (items/unit_items.py:17-93), what the platoon window lists; outside a unit the entity returns {}.


def _flag(value):
    return bool(value()) if hasattr(value, '__call__') else bool(value)


def platoon_members():
    """The platoon window's players as plain dicts, or [] outside a platoon."""
    try:
        from gui.prb_control.dispatcher import g_prbLoader
        dispatcher = g_prbLoader.getDispatcher()
        entity = dispatcher.getEntity() if dispatcher is not None else None
        players = call(entity, 'getPlayers', {}) or {}
        infos = list(players.values()) if hasattr(players, 'values') else []
    except Exception:
        log_exception('platoon helper: read')
        return []
    if len(infos) < 2:
        return []
    return [{'name': getattr(info, 'name', None), 'ready': _flag(getattr(info, 'isReady', False)), 'self': bool(call(info, 'isCurrentPlayer', False))}
            for info in infos]
