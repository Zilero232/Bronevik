# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.game import service

# What the lobby already shows, names from the RU 1.45 client source: the server name (connection manager),
# the ping the server selector measured (predefined hosts), the online counter of the lobby header.


def connection():
    try:
        from skeletons.connection_mgr import IConnectionManager
    except ImportError:
        return None
    return service(IConnectionManager)


def server_name():
    manager = connection()
    return getattr(manager, 'serverUserNameShort', None) or getattr(manager, 'serverUserName', None)


def request_ping():
    try:
        from predefined_hosts import g_preDefinedHosts
        g_preDefinedHosts.requestPing()
    except Exception:
        pass


def ping():
    manager = connection()
    url = getattr(manager, 'url', None)
    if not url:
        return None
    try:
        from predefined_hosts import g_preDefinedHosts
        return getattr(g_preDefinedHosts.getHostPingData(url), 'value', None)
    except Exception:
        return None


def online():
    try:
        from skeletons.gui.game_control import IServerStatsController
    except ImportError:
        return None, None
    stats = service(IServerStatsController)
    try:
        cluster, region, kind = stats.getStats()
    except Exception:
        return None, None
    if kind == 'unavailable':
        return None, None
    return cluster, (region if region != cluster else None)


# The selected vehicle, hangar only (RU 1.45 client source): Tankman.getNextSkillXpCost() is what the crew tooltip and
# the post-battle «until the next skill» read; the battle tiers are the server's own table the Demonstrator window
# reads (lobbyContext.getServerSettings().getRandomBattleLevelsForDemonstrator(): by vehicle name, else by class and
# tier); accelerated crew training is on for elite and premium vehicles (crew_widget setIsAcceleratedTraining).


def crew_next_skill(vehicle):
    best = (None, None)
    for _, tankman in getattr(vehicle, 'crew', None) or []:
        if tankman is None:
            continue
        try:
            cost = tankman.getNextSkillXpCost()
        except Exception:
            continue
        if cost and cost > 0 and (best[0] is None or cost < best[0]):
            best = (cost, getattr(tankman, 'roleUserName', None))
    return best


def battle_tiers(vehicle):
    try:
        from skeletons.gui.lobby_context import ILobbyContext
        levels = service(ILobbyContext).getServerSettings().getRandomBattleLevelsForDemonstrator()
        if vehicle.name in levels:
            return tuple(levels[vehicle.name])
        return tuple(levels[vehicle.type][vehicle.level - 1])
    except Exception:
        return None


def accelerated_training(vehicle):
    if vehicle is None:
        return None
    return bool(getattr(vehicle, 'isPremium', False) or getattr(vehicle, 'isElite', False))
