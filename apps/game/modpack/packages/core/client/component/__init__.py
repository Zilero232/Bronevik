"""What every feature component starts from: its strings added to the shared catalog, its settings section
of components.json, its on/off switch in config.json and `settings_changed(changed)` after the player changed
the section (bus `component_settings`)."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ...events import EVENT_COMPONENT_SETTINGS
from ...hud.panel import moved_values
from ...storage import account_file
from ..hud import component_config
from .constants import NOTICE_ERROR, NOTICE_INFO


class FeatureComponent(object):

    def __init__(self, app, component_id, schema, switch, strings):
        self.app = app
        self.component_id = component_id
        self.switch = switch
        app.translate.catalog.add(strings)
        self.settings = self.register(schema)
        app.bus.on(EVENT_COMPONENT_SETTINGS, self._on_component_settings)

    def register(self, schema):
        return component_config(self.app).section(self.component_id, schema)

    def _on_component_settings(self, component_id, changed):
        if component_id == self.component_id:
            self.settings_changed(changed)

    def settings_changed(self, changed):
        """The player changed this component's settings; `changed` holds the keys."""

    def enabled(self):
        return bool(self.app.config.is_enabled(self.switch))

    def enabled_in_hangar(self):
        return self.enabled() and not self.app.in_battle

    def follow_account(self, on_account):
        """Calls `on_account(account_id)` for the account already known and on every later one (bus `account`)."""
        self.app.bus.on('account', on_account)
        if self.app.account_id:
            on_account(self.app.account_id)

    def account_file(self, pattern, account_id):
        """The JsonFile `pattern % account_id` in the config folder, where one account's data of the component lives."""
        return account_file(self.app.config_dir, pattern, account_id)

    def save_place(self, props):
        """Keep where the player dragged (or how far they scaled) the component's hangar label."""
        return component_config(self.app).update(self.component_id, moved_values(props))

    def reset_place(self, keys):
        """Put the keys `keys` of the component's section back to their defaults; returns the changed keys."""
        defaults = self.settings.schema.defaults
        return component_config(self.app).update(self.component_id, dict((key, defaults[key]) for key in keys if key in defaults))

    def notice_info(self, key, **params):
        """The answer of a `ui_action` the window shows as information: the translated `key`."""
        return {'kind': NOTICE_INFO, 'text': self.app.translate(key, **params)}

    def notice_error(self, key, **params):
        """The answer of a `ui_action` the window shows as an error: the translated `key`."""
        return {'kind': NOTICE_ERROR, 'text': self.app.translate(key, **params)}
