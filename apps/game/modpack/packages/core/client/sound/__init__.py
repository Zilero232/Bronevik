"""2D sounds through the client's sound groups (the same call the vanilla GUI uses). A Wwise event must be
loaded by the client or a sound mod; an unknown name is logged, nothing else happens. `play_mp3` plays one of
our own MP3 files through the client's custom-MP3 event, the one Wwise-free path the client has."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...log import log_exception
from .constants import CUSTOM_MP3_EVENT, MP3_NAME


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


def play_mp3(name):
    """Plays `res/audioww/<name>.mp3` once (our CC0 sounds, tools/assets/sound.py); False when the client refuses.
    The sixth-sense lamp prepares its own file again before each play, so it keeps its sound."""
    if not name or not MP3_NAME.match(name):
        return False
    try:
        import SoundGroups
        import WWISE
        WWISE.WW_prepareMP3(str('%s.mp3' % name))
        SoundGroups.g_instance.getSound2D(str(CUSTOM_MP3_EVENT)).play()
    except Exception:
        log_exception('mp3 %s' % name)
        return False
    return True
