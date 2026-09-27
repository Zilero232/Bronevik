# -*- coding: utf-8 -*-
import os

from .values import clean_values, raw_key_of


def backup_path(config_dir, account_id):
    return os.path.join(config_dir, 'settings_backup_%d.json' % int(account_id))


class SettingsBackup(object):
    """The player's own values of every key an apply touched ("Вернуть мои").

    A second apply keeps the values saved by the first one, so restore always
    returns to the settings the player had before the first apply.
    """

    def __init__(self, storage):
        self.storage = storage

    def _read(self):
        data = self.storage.read(None)
        if not isinstance(data, dict) or not isinstance(data.get('values'), dict):
            return None
        return data

    def has(self):
        return bool(self.values())

    def save(self, current, changes, request_id, now):
        data = self._read() or {'values': {}}
        mine = clean_values(current)
        values = data['values']
        for group, field, _, _ in changes:
            key = raw_key_of(group, field)
            if key is not None and key in mine and key not in values:
                values[key] = mine[key]
        data['request_id'] = request_id
        data['saved_at'] = int(now)
        self.storage.write(data)
        return dict(values)

    def values(self):
        data = self._read()
        return clean_values(data['values']) if data is not None else {}

    def clear(self):
        self.storage.delete()
