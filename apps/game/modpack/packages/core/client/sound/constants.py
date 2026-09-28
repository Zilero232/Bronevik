from __future__ import absolute_import, division, print_function, unicode_literals

import re

# RU 1.45 client source (SoundGroups.prepareMP3, indicators.__playSoundEvent): the Wwise event 'sixthSense' plays the
# MP3 last prepared with WWISE.WW_prepareMP3('<name>.mp3') from res/audioww/. SoundGroups.prepareMP3 accepts only
# the names in CUSTOM_MP3_EVENTS, so ours are prepared through WWISE directly. UNVERIFIED on Lesta 1.45: that the
# event is loaded in the hangar (the settings window previews it there) and plays a file other than sixthSense.mp3.
CUSTOM_MP3_EVENT = 'sixthSense'
MP3_NAME = re.compile(r'^otmetki_[a-z0-9_]{1,40}$')
