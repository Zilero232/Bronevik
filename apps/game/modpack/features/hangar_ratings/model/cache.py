from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.me import ReadState
from .constants import OVERVIEW_KEY, REFRESH_AFTER_BATTLE_S


class RatingsCache(ReadState):
    """The account overview for the game session; the tank rows are the shared core read (`tank_ratings`)."""

    def __init__(self, account_id=None):
        ReadState.__init__(self)
        self.reset(account_id)

    def reset(self, account_id=None):
        ReadState.reset(self)
        self.account_id = account_id
        self.overview = None

    def store_overview(self, overview):
        self.done([OVERVIEW_KEY])
        if overview is not None:
            self.overview = overview

    def after_battle(self, now):
        self.stale([OVERVIEW_KEY], now, REFRESH_AFTER_BATTLE_S)
