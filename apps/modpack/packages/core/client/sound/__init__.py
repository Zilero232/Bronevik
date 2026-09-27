"""2D sounds through the client's sound groups (the same call the vanilla GUI uses). A Wwise event must be
loaded by the client or a sound mod; an unknown name is logged, nothing else happens."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...log import log_exception


def play_sound(event_name):
    """Plays `event_name` once; False when there is no name or the client refuses it."""
    if not event_name:
        return False
    try:
        import SoundGroups
        SoundGroups.g_instance.playSound2D(str(event_name))
    except Exception:
        log_exception('sound %s' % event_name)
        return False
    return True
