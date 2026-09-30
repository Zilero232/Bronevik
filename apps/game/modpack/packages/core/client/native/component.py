from __future__ import absolute_import, division, print_function, unicode_literals

from ..component import FeatureComponent
from .account_settings import apply_account_changed
from .defaults import ClientDefaults, section_is_new
from .settings_core import apply_changed


class NativeSettingsComponent(FeatureComponent):
    """A component whose values become the player's client settings. They are written only when the
    player changes them (the settings window, a profile load: bus `component_settings`) and only in the
    hangar, so a later change in the game's own settings window is never overridden (a RecommendedSettingsComponent
    also writes its defaults once on a fresh install). `to_account` maps the
    values kept in the client's AccountSettings instead of the settings core (the minimap size)."""

    def __init__(self, app, component_id, schema, switch, strings, to_native, to_account=None):
        FeatureComponent.__init__(self, app, component_id, schema, switch, strings)
        self.to_native = to_native
        self.to_account = to_account

    def desired(self):
        return self.to_native(self.settings.to_dict())

    def client_values(self, values):
        """(settings core values, AccountSettings values) of the section `values`."""
        account = self.to_account(values) if self.to_account is not None else {}
        return self.to_native(values), account

    def settings_changed(self, changed):
        if self.enabled_in_hangar():
            self.apply()

    def apply(self):
        applied = apply_changed(self.desired())
        if self.to_account is None:
            return applied
        account = self.to_account(self.settings.to_dict())
        if account and not apply_account_changed(account):
            return False
        return applied


class RecommendedSettingsComponent(NativeSettingsComponent):
    """A NativeSettingsComponent whose schema defaults are the recommended client settings: written once on a fresh
    install with a backup, and offered on its card (`ClientDefaults`)."""

    def __init__(self, app, component_id, schema, switch, strings, to_native, to_account=None):
        is_new_section = section_is_new(app, component_id)
        NativeSettingsComponent.__init__(self, app, component_id, schema, switch, strings, to_native, to_account)
        self.client_defaults = ClientDefaults(self, is_new_section)

    def ui_actions(self):
        return self.client_defaults.ui_actions()

    def ui_action(self, action, row=None, value=None):
        return self.client_defaults.ui_action(action)
