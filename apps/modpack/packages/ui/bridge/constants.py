from __future__ import absolute_import, division, print_function, unicode_literals

# Bus events the window emits (features and the HUD layer subscribe on app.bus):
#   component_settings(component_id, changed_keys)  settings of a card changed (window, profile load)
#   language(language)                               the player switched the mod language
EVENT_COMPONENT_SETTINGS = 'component_settings'
EVENT_LANGUAGE = 'language'
CONFIG_COMPONENT = 'config'

LANGUAGES = ('ru', 'en')
LANGUAGE_CHOICES = ('auto',) + LANGUAGES

NOTICE_INFO = 'info'
NOTICE_ERROR = 'error'
NOTICE_CODE = 'code'

SITE_URL = 'https://triotmetki.ru'
API_PREFIX = 'https://api.'
LOCAL_SITE_URL = 'http://localhost:3000'
LOCAL_HOSTS = ('http://localhost', 'http://127.0.0.1')
