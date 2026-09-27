from __future__ import absolute_import

import time

from ...core.client.native import apply_settings, read_settings
from ...core.jsonutil import loads
from ..settings_share import (POLL_PATH, SETTINGS_PATH, SettingsBackup, SettingsShareError, backup_path, build_export_request,
                              build_poll_request, build_result_request, changes_to_values, clean_values, parse_poll_response,
                              plan_apply, raw_key_of, result_path, signed_post)
from ...core.storage import JsonFile
from ..version import MOD_ID, VERSION
from ...core.log import log, log_exception, safe

POLL_EVERY_S = 120.0

# raw key (settings_share.FIELDS) -> settings-core setting name.
# Names come from WoT-era account_helpers.settings_core.settings_constants
# and are UNVERIFIED on Lesta 1.45; a name the core does not know reads as None
# and is dropped by the whitelist, so a wrong entry is harmless.
CORE_NAMES = {
    'fov': 'fov',
    'vsync': 'vertSync',
    'tripleBuffering': 'tripleBuffered',
    'postMortem': 'enablePostMortemEffect',
    'sniperDynamicCamera': 'dynamicCamera',
    'horizontalStabilisation': 'horStabilizationSnp',
    'arcadeSens': 'mouseArcadeSens',
    'sniperSens': 'mouseSniperSens',
    'artillerySens': 'mouseStrategicSens',
    'invert': 'mouseVertInvert',
    'minimapViewRange': 'minimapViewRange',
    'minimapDrawRange': 'minimapDrawRange',
    'volumeMaster': 'masterVolume',
    'volumeMusic': 'musicVolume',
}


def read_client_settings():
    """Flat raw values (whitelisted) read through the settings core, or None if unavailable."""
    current = read_settings(CORE_NAMES.values())
    if current is None:
        return None
    return clean_values(dict((key, current[name]) for key, name in CORE_NAMES.items() if name in current))


def write_client_settings(values):
    return apply_settings(dict((CORE_NAMES[key], value) for key, value in clean_values(values).items() if key in CORE_NAMES))


def show_confirm(title, message, callback):
    """Hangar yes/no dialog. False when the dialog API is unavailable (then nothing is applied)."""
    try:
        from gui import DialogsInterface
        from gui.Scaleform.daapi.view.dialogs import I18nConfirmDialogButtons, SimpleDialogMeta
        DialogsInterface.showDialog(SimpleDialogMeta(title=title, message=message, buttons=I18nConfirmDialogButtons()), callback)
        return True
    except Exception:
        log_exception('settings confirm dialog')
        return False


class SettingsShare(object):
    """Hangar-only export of own settings and user-confirmed apply of a creator's settings."""

    def __init__(self, app, config_dir):
        self.app = app
        self.config_dir = config_dir
        self.last_poll = 0.0
        self.polling = False
        self.asked = set()

    def _in_hangar(self):
        return not self.app.in_battle and self.app.account_id is not None

    def _enabled(self):
        return self.app.config.is_enabled('share_settings') and self.app.is_bound() and not self.app.auth_failed

    def _backup(self):
        return SettingsBackup(JsonFile(backup_path(self.config_dir, self.app.account_id)))

    def _post(self, path, payload, callback):
        creds = self.app.current_credentials()
        signed_post(self.app.transport, self.app.config.endpoint(path), creds, payload, '%s/%s' % (MOD_ID, VERSION), callback)

    @safe
    def on_hangar(self):
        """Run the one-shot `settings_action` from config.json ('export' / 'restore')."""
        action = self.app.config.get('settings_action')
        if not action or not self._in_hangar():
            return
        self.app.config.update({'settings_action': ''})
        self.app.save_config()
        if action == 'export':
            self.export()
        elif action == 'restore':
            self.restore()

    def export(self):
        if not self._in_hangar() or not self._enabled():
            return
        values = read_client_settings()
        if values is None:
            self.app.ui.notify(self.app.translate('settings_unavailable'))
            return
        config = self.app.config
        try:
            payload = build_export_request(self.app.current_credentials(), VERSION, config.get('settings_target'),
                                           config.get('settings_anonymous_stats'), values)
        except SettingsShareError as error:
            self.app.ui.notify(self.app.translate('settings_export_failed', reason=error.reason))
            return

        @safe
        def done(status, body, headers):
            if 200 <= status < 300:
                self.app.ui.notify(self.app.translate('settings_exported'))
            else:
                self.app.ui.notify(self.app.translate('settings_export_failed', reason='http_%d' % status))

        self._post(SETTINGS_PATH, payload, done)

    def restore(self):
        if not self._in_hangar():
            return
        backup = self._backup()
        values = backup.values()
        if not values:
            self.app.ui.notify(self.app.translate('settings_no_backup'))
            return
        if write_client_settings(values):
            backup.clear()
            self.app.ui.notify(self.app.translate('settings_restored'))
        else:
            self.app.ui.notify(self.app.translate('settings_unavailable'))

    @safe
    def tick(self, now):
        if self.polling or now - self.last_poll < POLL_EVERY_S or not self._in_hangar() or not self._enabled():
            return
        self.last_poll = now
        self.polling = True
        account_id = self.app.account_id

        @safe
        def done(status, body, headers):
            self.polling = False
            if status != 200 or account_id != self.app.account_id:
                return
            try:
                data = loads(body)
            except (ValueError, UnicodeDecodeError):
                return
            for request in parse_poll_response(data):
                if request['id'] not in self.asked:
                    self._ask(request)
                    return

        self._post(POLL_PATH, build_poll_request(self.app.current_credentials()), done)

    def _ask(self, request):
        self.asked.add(request['id'])
        current = read_client_settings()
        if current is None:
            log('settings core unavailable, apply request %s stays pending' % request['id'])
            return
        config = self.app.config
        changes = plan_apply(current, request, config.get('settings_include_resolution'), config.get('settings_include_sensitivity'))
        writable = [change for change in changes if raw_key_of(change[0], change[1]) in CORE_NAMES]
        if not writable:
            if changes:
                log('apply request %s has no settings this client can write' % request['id'])
            self._report(request['id'], 'rejected' if changes else 'applied')
            return
        changes = writable
        translate = self.app.translate
        title = translate('settings_apply_title', slug=request['profile_slug'])
        message = translate('settings_apply_body', count=len(changes), groups=', '.join(sorted(set(c[0] for c in changes))))

        @safe
        def answered(confirmed):
            if not self._in_hangar():
                self.asked.discard(request['id'])
                return
            if confirmed:
                self._apply(request, current, changes)
            else:
                self._report(request['id'], 'rejected')

        if not show_confirm(title, message, answered):
            log('confirm dialog unavailable, apply request %s stays pending' % request['id'])

    def _apply(self, request, current, changes):
        self._backup().save(current, changes, request['id'], time.time())
        if write_client_settings(changes_to_values(changes)):
            self._report(request['id'], 'applied')
            self.app.ui.notify(self.app.translate('settings_applied'))
        else:
            self.app.ui.notify(self.app.translate('settings_unavailable'))

    def _report(self, request_id, status):
        try:
            path = result_path(request_id)
            payload = build_result_request(self.app.current_credentials(), status)
        except SettingsShareError as error:
            log('settings result not sent: %s' % error.reason)
            return
        self._post(path, payload, lambda *args: None)
