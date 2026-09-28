from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.me import OK_STATUS, device_body
from .constants import (BOTH_CHANNELS, CHANNELS, SHARE_REFUSED, SHARE_REFUSED_STATUSES, SHARE_RETRY, SHARE_SEND_FAILED, SHARE_SEND_FAILURES,
                        SHARE_SYNCED)

# Opt-in (share_session_report, off by default): the server builds and posts the card from the account's own
# battles; the mod only switches the server flag and asks for a card of its own session id.


def channels_of(choice):
    return list(CHANNELS) if choice == BOTH_CHANNELS else [choice] if choice in CHANNELS else [CHANNELS[0]]


def preference_body(credentials, enabled, choice):
    body = device_body(credentials)
    body.update({'enabled': bool(enabled), 'channels': channels_of(choice)})
    return body


def send_body(credentials, session_id, choice):
    body = device_body(credentials)
    body.update({'session_id': session_id, 'channels': channels_of(choice)})
    return body


def preference_of(config):
    return bool(config.get('share_session_report')), config.get('share_session_channel')


def send_failure_key(status):
    """The notice for a refused /send: 409 channel_not_linked and 404 session_not_found get their own short line."""
    return SHARE_SEND_FAILURES.get(status, SHARE_SEND_FAILED)


def preference_outcome(status):
    if status == OK_STATUS:
        return SHARE_SYNCED
    return SHARE_REFUSED if status in SHARE_REFUSED_STATUSES else SHARE_RETRY
