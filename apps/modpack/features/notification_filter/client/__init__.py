from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import FeatureComponent
from ....core.hooks import override
from ....core.log import log
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import hidden_types, type_table_of
from ..settings import SCHEMA, SWITCH

# RU 1.45: notification.NotificationsModel.addNotification lists and counts an entry of the notification
# centre; a hidden one is neither.


def _client_classes():
    try:
        from notification.NotificationsModel import NotificationsModel
        from notification.settings import NOTIFICATION_TYPE
        return NotificationsModel, NOTIFICATION_TYPE
    except Exception:
        return None, None


class NotificationFilter(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.hidden = 0
        model, types = _client_classes()
        self.types = type_table_of(types) if types is not None else {}
        if model is None:
            log('notification filter: notification centre not found, feature off')
            return
        override(model, 'addNotification')(self._add_notification)

    def blocked(self):
        if not self.enabled():
            return frozenset()
        return hidden_types(self.settings.to_dict(), self.types)

    def _add_notification(self, original, model, notification, *args, **kwargs):
        if notification.getType() in self.blocked():
            self.hidden += 1
            return None
        return original(model, notification, *args, **kwargs)
