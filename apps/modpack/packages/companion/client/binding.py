from __future__ import absolute_import

from ...core.jsonutil import dumps_bytes
from ...core.log import safe
from ..binding import BIND_PATH, BindError, build_bind_request, parse_bind_response
from ..payload import REALM
from ..sender import parse_json_body
from ..version import VERSION
from .game import client_version


class Binder(object):
    """Binding the mod to the site account: a one-time code in, per-account device credentials out."""

    def __init__(self, app):
        self.app = app

    def bind_from_config(self):
        app = self.app
        code = app.config.get('bind_code')
        if code:
            app.config.update({'bind_code': ''})
            app.save_config()
            self.bind(code)

    def bind(self, raw_code):
        app = self.app
        if not app.account_id:
            app.ui.notify(app.translate('bind_no_account'))
            return
        try:
            request = build_bind_request(raw_code, app.account_id, VERSION, client_version(), REALM)
        except BindError as error:
            key = 'bind_no_account' if error.reason == 'no_account' else 'bind_invalid_code'
            app.ui.notify(app.translate(key))
            return
        account_id = app.account_id
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json', 'User-Agent': app.user_agent()}

        @safe
        def done(status, body, response_headers):
            data = parse_json_body(body)
            if status != 200:
                reason = (data or {}).get('error') or ('http_%d' % status)
                app.ui.notify(app.translate('bind_failed', reason=reason))
                return
            try:
                creds = parse_bind_response(data, account_id)
            except BindError as error:
                app.ui.notify(app.translate('bind_failed', reason=error.reason))
                return
            app.credentials.save(creds)
            if account_id == app.account_id:
                app.rebuild_sender()
            app.ui.notify(app.translate('bind_success'))
            app.settings_ui.refresh()

        app.transport.request('POST', app.config.endpoint(BIND_PATH), headers, dumps_bytes(request), done)
