from __future__ import absolute_import, division, print_function, unicode_literals

from ..components import ACTION_SETTINGS_EXPORT, ACTION_SETTINGS_RESTORE


class CompanionActions(object):

    def __init__(self, config, labels):
        self.config = config
        self.labels = labels

    def ui_actions(self):
        if not self.config.is_enabled('share_settings'):
            return []
        labels = self.labels()
        return [
            {'id': ACTION_SETTINGS_EXPORT, 'label': labels.text('action_settings_export'), 'confirm': None},
            {'id': ACTION_SETTINGS_RESTORE, 'label': labels.text('action_settings_restore'), 'confirm': labels.text('confirm_settings_restore')},
        ]
