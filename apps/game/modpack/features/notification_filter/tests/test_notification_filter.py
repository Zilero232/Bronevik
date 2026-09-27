from __future__ import absolute_import, division, print_function, unicode_literals

import unittest

import _support  # noqa: F401
from otmetki.core.settings import Settings
from otmetki.features.notification_filter.i18n import STRINGS
from otmetki.features.notification_filter.model import hidden_types, type_table_of
from otmetki.features.notification_filter.settings import SCHEMA, SETTINGS


class NOTIFICATION_TYPE(object):
    UNDEFINED = 0
    MESSAGE = 1
    INVITE = 2
    FRIENDSHIP_RQ = 3
    NOTIFY_CENTER_POP_UP = 4
    CLAN_INVITES = 5
    RECRUIT_REMINDER = 13
    AUCTION_STAGE_START = 19
    TRADING_CARAVAN_REFILL = 19
    WOT_PLUS_INTRO = 22
    RANGE = None


class NotificationFilterTest(unittest.TestCase):

    def setUp(self):
        self.types = type_table_of(NOTIFICATION_TYPE)

    def test_type_table(self):
        assert self.types['MESSAGE'] == 1 and 'RANGE' not in self.types

    def test_defaults_hide_promo_only(self):
        assert hidden_types(Settings(None, SCHEMA).to_dict(), self.types) == frozenset([4, 19, 22])

    def test_groups(self):
        values = Settings({'hide_promo': False, 'hide_reminders': True, 'hide_friend_requests': True, 'hide_clan': True}, SCHEMA).to_dict()
        assert hidden_types(values, self.types) == frozenset([13, 3, 5])

    def test_messages_and_invites_stay(self):
        values = dict((key, True) for key in SCHEMA.defaults)
        hidden = hidden_types(values, self.types)
        assert 1 not in hidden and 2 not in hidden and 0 not in hidden
        assert hidden_types(values, {}) == frozenset()

    def test_settings(self):
        assert SETTINGS == ('hangar_notification_filter',)
        assert sorted(STRINGS['ru']) == sorted(STRINGS['en'])


if __name__ == '__main__':
    unittest.main()
