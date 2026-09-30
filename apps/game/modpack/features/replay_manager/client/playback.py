"""'Watch': the client cannot play a replay inside a hangar session, so the hangar stores the request and restarts the
client; on the next start, before the gameplay machine runs, the mod puts the client's own replay machine in its place
(the path the client takes for a replay opened from Windows) and, when the replay ends, restarts into the login screen
instead of quitting. RU 1.45 client source: BattleReplay.py :363-466, gameplay/machine.py :30-46,
gameplay/delegator.py, game.py :90-205 (mods load in gui_personality.init, before ServiceLocator.gameplay.start)."""
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import time

from ....core.client.game import client_attr
from ....core.hooks import override
from ....core.log import log, log_exception, safe
from ....core.storage import JsonFile
from ..model import LAUNCH_FILE, launch_request, pending_launch
from .constants import BOOT_CONFIG_DIR, RESTART_DELAY_S


class _Session(object):
    path = None


def _store():
    return JsonFile(os.path.join(BOOT_CONFIG_DIR, LAUNCH_FILE))


def product_version():
    getter = client_attr('BigWorld', 'getProductVersion')
    try:
        return getter() if getter is not None else None
    except Exception:
        return None


def replay_busy():
    controller = client_attr('BattleReplay', 'g_replayCtrl')
    return bool(controller is not None and (getattr(controller, 'isPlaying', False) or getattr(controller, 'isRecording', False)))


def can_play():
    return client_attr('BigWorld', 'restartGame') is not None and client_attr('BattleReplay', 'g_replayCtrl') is not None


def request_play(path):
    """Stores the request and restarts the client (hangar side; the caller checked `play_refusal`)."""
    import BigWorld
    _store().write(launch_request(os.path.abspath(path), time.time()))
    log('replay manager: restart to play %s' % os.path.basename(path))
    BigWorld.savePreferences()
    BigWorld.callback(RESTART_DELAY_S, BigWorld.restartGame)


@safe
def boot():
    """Runs from the entry script at client start: plays the stored request once, if there is a fresh one."""
    store = _store()
    data = store.read(None)
    if data is None:
        return False
    store.delete()
    path = pending_launch(data, time.time(), os.path.isfile)
    if path is None:
        log('replay manager: stale play request dropped')
        return False
    try:
        _start(path)
    except Exception:
        _Session.path = None
        log_exception('replay manager: replay start')
        return False
    log('replay manager: playing %s' % os.path.basename(path))
    return True


def _start(path):
    import BattleReplay
    from gameplay.listeners import PlayerEventsAdaptor
    from gameplay.machine import BattleReplayMachine
    from helpers import dependency
    from skeletons.gameplay import IGameplayLogic
    logic = dependency.instance(IGameplayLogic)
    previous = logic._GameplayLogic__machine
    machine = BattleReplayMachine()
    for observer in list(previous._StateMachine__observers._observers):
        machine.connect(observer)
    _Session.path = path
    controller = BattleReplay.BattleReplay

    @override(controller, 'getAutoStartFileName')
    def auto_start_name(call, self):
        return _Session.path or call(self)

    @override(controller, 'autoStartBattleReplay')
    def auto_start(call, self):
        return _restart_instead_of_quit(call, self)

    @override(controller, 'stop')
    def stop(call, self, *args, **kwargs):
        return _restart_instead_of_quit(call, self, *args, **kwargs)

    logic._GameplayLogic__machine = machine
    logic._GameplayLogic__adaptor = PlayerEventsAdaptor(machine)


def _restart_instead_of_quit(call, *args, **kwargs):
    """The client quits after a replay it was started with; ours goes back to the login screen instead."""
    import BigWorld
    if _Session.path is None:
        return call(*args, **kwargs)
    quit_game = BigWorld.quit
    BigWorld.quit = BigWorld.restartGame
    try:
        return call(*args, **kwargs)
    finally:
        BigWorld.quit = quit_game
