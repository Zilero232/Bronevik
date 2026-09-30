from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import is_number


def battle_started_at(seen_at, results, to_local):
    """When the battle started on this computer's clock: the moment the client saw it start, else the results'
    arenaCreateTime (a server time) through `to_local`, the client's conversion (helpers.time_utils.makeLocalServerTime)."""
    if seen_at is not None:
        return seen_at
    common = results.get('common') if isinstance(results, dict) and isinstance(results.get('common'), dict) else {}
    created = common.get('arenaCreateTime')
    if not is_number(created) or isinstance(created, bool) or created <= 0:
        return None
    local = to_local(created)
    return float(local) if is_number(local) and local > 0 else None
