from __future__ import absolute_import, division, print_function, unicode_literals

EVENT_COMPONENT_SETTINGS = 'component_settings'
EVENT_REPLAY_UPLOADED = 'replay_uploaded'
# replay_upload_request(request, reply): the replay manager asks the replay upload to send one replay (request None only asks
# whether it can); the upload answers reply(state) at once, and nobody answers when it is not installed.
EVENT_REPLAY_UPLOAD_REQUEST = 'replay_upload_request'
# settings_open(section): a package asks the in-game settings window to open at one of its pages (`battle`, `hangar`,
# `marks`, `replays`, `streamer`, `data`, `profiles`, `hud`); the ui package answers, nobody does without it.
EVENT_SETTINGS_OPEN = 'settings_open'
