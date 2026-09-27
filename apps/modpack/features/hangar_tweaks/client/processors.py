"""The client's own item processors, the same requests its hangar buttons send. Names follow the WoT-era
client (gui.shared.gui_items.processors) and are UNVERIFIED on Lesta 1.45: an import or call failure is
logged and reported to the player, nothing else happens."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.log import log_exception


def _run(processor, done):
    def finished(result):
        done(bool(getattr(result, 'success', False)))

    try:
        processor.request(finished)
    except Exception:
        log_exception('hangar quick action')
        done(False)


def demount(vehicle, device, slot, done):
    try:
        from gui.shared.gui_items.processors.module import getInstallerProcessor
        processor = getInstallerProcessor(vehicle, device, slot, install=False)
    except Exception:
        log_exception('demount processor')
        done(False)
        return
    _run(processor, done)


def unload_crew(vehicle, done):
    try:
        from gui.shared.gui_items.processors.tankman import TankmanUnload
        processor = TankmanUnload(vehicle)
    except Exception:
        log_exception('crew unload processor')
        done(False)
        return
    _run(processor, done)
