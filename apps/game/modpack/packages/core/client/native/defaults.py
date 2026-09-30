from __future__ import absolute_import, division, print_function, unicode_literals

from ...native_settings import (
    ACTION_RECOMMENDED,
    ACTION_RESTORE,
    BACKUP_STATE_KEY,
    STAMP_STATE_KEY,
    STEP_NATIVE,
    NativeState,
    client_keys,
    is_recommended,
    native_choices,
    offered_action,
    recommended,
)
from ..hud import component_config
from .account_settings import apply_account_changed, read_account_settings
from .constants import STATE_ATTR
from .settings_core import apply_settings, read_settings


def native_state(app):
    """The NativeState every client-settings component of `app` shares, kept in state.json."""
    state = getattr(app, STATE_ATTR, None)
    if state is not None:
        return state
    stored = app.state or {}
    state = NativeState(stored.get(BACKUP_STATE_KEY), stored.get(STAMP_STATE_KEY))
    setattr(app, STATE_ATTR, state)
    app.register_state(BACKUP_STATE_KEY, state.dump_backups)
    app.register_state(STAMP_STATE_KEY, state.dump_stamps)
    return state


def section_is_new(app, component_id):
    """True while components.json has no section of `component_id` yet (call it before the component registers)."""
    return component_config(app).raw(component_id) is None


class ClientDefaults(object):
    """The schema defaults of a client-settings component as recommended client settings. On a fresh install they
    are written once, the first time the hangar shows with the switch on, after the client values they replace are
    kept in state.json; the card then offers them back (the restore button). With the switch off then, and on an
    existing install for a section it creates, the client values start at 'native' and nothing is written; the card
    offers the recommended values with the same backup.

    `component` is a FeatureComponent with `client_values(values)` ((settings core values, AccountSettings values) of
    its section `values`) and `apply()` (writes the current section); `is_new_section` from `section_is_new`."""

    def __init__(self, component, is_new_section):
        self.component = component
        self.app = app = component.app
        self.component_id = component.component_id
        self.schema = component.settings.schema
        self.keys = client_keys(self.schema)
        self.state = native_state(app)
        if self.state.enroll(self.component_id, app.fresh_install):
            if is_new_section and not app.fresh_install:
                self._update(native_choices(self.keys))
            app.save_state()
        app.bus.on('hangar', self._on_hangar)

    def _update(self, values):
        component_config(self.app).update(self.component_id, values)

    def _on_hangar(self):
        step = self.state.hangar_step(self.component_id, self.component.enabled())
        if step is None:
            return
        if step == STEP_NATIVE:
            self._update(native_choices(self.keys))
        elif not self._apply_with_backup(self.component.settings.to_dict()):
            return

        self.state.settle(self.component_id)
        self.app.save_state()

    def _apply_with_backup(self, values):
        if not self._keep_backup(values):
            return False
        self.component.apply()
        return True

    def _keep_backup(self, values):
        settings, account = self.component.client_values(values)
        current = read_settings(list(settings))
        if current is None:
            return False
        current_account = (read_account_settings(list(account)) or {}) if account else {}
        self.state.keep(self.component_id, current, current_account)
        return True

    def ui_actions(self):
        if self.app.in_battle:
            return []
        has_backup = self.state.backup(self.component_id) is not None
        if not has_backup and not self.component.enabled():
            return []
        action = offered_action(has_backup, is_recommended(self.component.settings.to_dict(), self.schema, self.keys))
        if action is None:
            return []
        translate = self.app.translate
        key = '%s_%s' % (self.component_id, action)
        return [{'id': action, 'label': translate(key), 'confirm': translate(key + '_confirm')}]

    def ui_action(self, action):
        if action == ACTION_RESTORE:
            return self._restore()
        if action == ACTION_RECOMMENDED:
            return self._recommend()
        return None

    def _restore(self):
        backup = self.state.backup(self.component_id)
        if backup is None or self.app.in_battle:
            return None
        settings, account = backup
        if not apply_settings(settings) or (account and not apply_account_changed(account)):
            return self._failed()
        self._update(native_choices(self.keys))
        self.state.drop(self.component_id)
        self.app.save_state()
        return None

    def _recommend(self):
        if not self.component.enabled_in_hangar():
            return None
        wanted = recommended(self.schema, self.keys)
        values = dict(self.component.settings.to_dict())
        values.update(wanted)
        if not self._keep_backup(values):
            return self._failed()
        self._update(wanted)
        self.component.apply()
        self.app.save_state()
        return None

    def _failed(self):
        return self.component.notice_error('%s_native_failed' % self.component_id)
