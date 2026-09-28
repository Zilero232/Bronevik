"""The bound account's own reads from the site (`/mod/me/*`, signed like /mod/ingest): request bodies, answer
parsing that drops anything about another account, retry delays and the keyed read state. Pure; the signed
transport and the shared tank read are `core/client/me`."""
from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import (MAX_TANKS, OK_STATUS, REFRESH_AFTER_BATTLE_S, RETRY_AFTER_ERROR_S, RETRY_AFTER_LIMIT_S, MAX_RETRY_S, TANK_KEY,  # noqa: F401
                        TANKS_PATH)
from .parse import count, expected, number, owned, rating, records, stats, tank_rows  # noqa: F401
from .reads import ReadState  # noqa: F401
from .requests import device_body, is_auth_failure, retry_delay, tank_ids, tanks_request  # noqa: F401


def tank_key(tank_id):
    return TANK_KEY % tank_id
