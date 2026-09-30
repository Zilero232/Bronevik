from __future__ import absolute_import, division, print_function, unicode_literals

import re

# RU 1.45 client source: hangar spaces are the folders under res/spaces with a space.settings/hangarSettings
# (gui.ClientHangarSpace._readHangarSettings), addressed as 'spaces/<folder>' in lower case.
SPACES_PREFIX = 'spaces/'
SPACE_NAME = re.compile(r'^[a-z0-9_]{1,64}$')

ACTION_CHOOSE = 'choose'
ACTION_NATIVE = 'native'
ROW_NATIVE = 'native'
