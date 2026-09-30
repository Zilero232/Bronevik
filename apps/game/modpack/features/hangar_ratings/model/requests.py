from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.compat import to_text
from ....core.me import owned, stats
from .constants import RATING_METRICS, SESSION_RATINGS


def parse_overview(data, account_id):
    if not owned(data, account_id):
        return None
    overall = data.get('overall')
    session = data.get('session')
    nickname = data.get('nickname')
    parsed = {
        'account_id': account_id,
        'nickname': to_text(nickname) if nickname else None,
        'overall': stats(overall, RATING_METRICS) if isinstance(overall, dict) else None,
        'session': None,
    }
    if isinstance(session, dict):
        parsed['session'] = stats(session, SESSION_RATINGS)
        parsed['session']['is_live'] = session.get('is_live') is True
    return parsed

