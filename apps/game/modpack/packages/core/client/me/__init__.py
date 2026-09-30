"""The bound account's own reads from the site on the app's transport: `post_signed` (one signed /mod/me
request) and `tank_ratings(app)`, the process-wide read of the player's own tank rows (`/mod/me/tanks`:
ratings, career records, WN8 expected values), shared by the features that show them so each tank is read
once per game session and again after its own battles."""
from __future__ import absolute_import, division, print_function, unicode_literals

import time

from ...codec import encode_json, parse_json_body, parse_retry_after
from ...errors import ReasonError
from ...log import log, log_exception, safe
from ...me import (OK_STATUS, REFRESH_AFTER_BATTLE_S, TANKS_PATH, ReadState, device_body, is_auth_failure, retry_delay, tank_key, tank_rows,
                   tanks_request)
from ...me.constants import MAX_WATCHED_TANKS
from ...net.signing import signed_request

_state = {'service': None}


def can_read(app):
    """True in the hangar of a bound account whose device the server has not refused."""
    return app.is_bound() and not app.auth_failed and not app.in_battle


def post_signed(app, path, payload, on_done):
    """POSTs `payload` to `path` signed with the bound device (raises ReasonError('not_bound') without one).
    `on_done(status, data, retry_after)` gets the JSON object of a 200 answer (else None); a 401/403 also
    pauses the app like the outbox does (`on_auth_failed`, the rebind notice)."""
    credentials = app.current_credentials()
    if credentials is None or not credentials.is_valid():
        raise ReasonError('not_bound')

    @safe
    def done(status, body, headers):
        if is_auth_failure(status):
            app.on_auth_failed()
        on_done(status, parse_json_body(body) if status == OK_STATUS else None, parse_retry_after(headers))

    signed_request(app.transport, 'POST', app.config.endpoint(path), credentials.device_id, credentials.secret, encode_json(payload),
                   app.user_agent(), done)


def signed_read(app, reads, key, path, build, account_of, on_data, on_end=None):
    """One keyed read of the bound account's own data: POSTs `build()` to `path` (a ReasonError from it skips the read
    and is logged) with `key` of `reads` (a ReadState) pending. An answer that arrives after `account_of()` changed is
    dropped; a 200 marks `key` done and gets `on_data(data, account_id)`, any other status backs `key` off
    (`retry_delay`); `on_end()` runs after either. Returns True when the request went out."""
    try:
        payload = build()
    except ReasonError as error:
        log('%s not requested: %s' % (path, error.reason))
        return False
    account_id = account_of()
    reads.start([key])

    def done(status, data, retry_after):
        if account_of() != account_id:
            return
        if status == OK_STATUS:
            reads.done([key])
            on_data(data, account_id)
        else:
            reads.fail([key], time.time(), retry_delay(status, retry_after))
        if on_end is not None:
            on_end()

    post_signed(app, path, payload, done)
    return True


def signed_body(app, **fields):
    """{device_id, account_id} of the bound device plus `fields`."""
    body = device_body(app.current_credentials())
    body.update(fields)
    return body


class TankRatings(object):
    """Rows of the player's own tanks from /mod/me/tanks, per account, in memory for the game session."""

    def __init__(self, app):
        self.app = app
        self.account_id = app.account_id
        self.rows = {}
        self.reads = ReadState()
        self.watched = []
        self.listeners = []
        bus = app.bus
        bus.on('account', self._on_account)
        bus.on('rebind', self._on_rebind)
        bus.on('battle_event', self._on_battle_event)
        bus.on('tick', self._on_tick)

    def listen(self, callback):
        """`callback(tank_id)` after a read of that tank finished (with or without a row); a failing one is logged
        and the others still run."""
        self.listeners.append(callback)

    def row(self, tank_id):
        return self.rows.get(tank_id)

    def _on_account(self, account_id):
        self.account_id = account_id
        self.rows = {}
        self.reads.reset()

    def _on_rebind(self):
        self._on_account(self.app.account_id)

    def _on_battle_event(self, event, now):
        tank_id = (event.get('vehicle') or {}).get('tank_id')
        if tank_id:
            self.reads.stale([tank_key(tank_id)], now, REFRESH_AFTER_BATTLE_S)

    def _on_tick(self, now):
        for tank_id in list(self.watched):
            self.ensure(tank_id, now)

    def ensure(self, tank_id, now=None):
        """Reads `tank_id` when it is due (hangar, bound); returns True when a request went out."""
        if not tank_id or not can_read(self.app):
            return False
        if tank_id in self.watched:
            self.watched.remove(tank_id)
        self.watched.append(tank_id)
        del self.watched[:-MAX_WATCHED_TANKS]
        now = time.time() if now is None else now
        key = tank_key(tank_id)
        if not self.reads.wants(key, now):
            return False
        def store(data, account_id):
            rows = tank_rows(data, account_id)
            if tank_id in rows:
                self.rows[tank_id] = rows[tank_id]

        return signed_read(self.app, self.reads, key, TANKS_PATH, lambda: tanks_request(self.app.current_credentials(), [tank_id]),
                           lambda: self.account_id, store, lambda: self._notify(tank_id))

    def _notify(self, tank_id):
        for callback in list(self.listeners):
            try:
                callback(tank_id)
            except Exception:
                log_exception('tank ratings listener')


def tank_ratings(app):
    """The process-wide tank read (created on first use, so features need no load order)."""
    if _state['service'] is None or _state['service'].app is not app:
        _state['service'] = TankRatings(app)
    return _state['service']
