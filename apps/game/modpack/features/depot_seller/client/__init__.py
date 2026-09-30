# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.client.component import FeatureComponent
from ....core.log import safe
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import ACTION_REFRESH, ACTION_SELL, REFUSE_CHANGED, build_page, confirm_text, plan, signature
from ..settings import SCHEMA, SWITCH
from .reads import depot_items, reserve_crew, tankmen_by_id
from .sell import sell


# The depot sale: the window page lists what the settings put on sale, «Продать» asks with the items and the credits
# and sends the depot's own request only when the stock is still what the player confirmed.
class DepotSeller(FeatureComponent):

    def __init__(self, app):
        FeatureComponent.__init__(self, app, FEATURE_ID, SCHEMA, SWITCH, STRINGS)
        self.shown = None
        self.busy = False

    def _plan(self):
        return plan(depot_items(), reserve_crew(), self.settings.to_dict())

    def ui_actions(self):
        if not self.enabled_in_hangar():
            return []
        translate = self.app.translate
        sale, _refusal = self._plan()
        self.shown = signature(sale)
        refresh = {'id': ACTION_REFRESH, 'label': translate('depot_seller_refresh'), 'confirm': None}
        if sale is None or self.busy:
            return [refresh]
        confirm = confirm_text(sale, translate)
        return [{'id': ACTION_SELL, 'label': translate('depot_seller_sell'), 'confirm': confirm}, refresh]

    def ui_page(self):
        if not self.enabled_in_hangar():
            return None
        sale, refusal = self._plan()
        return build_page(sale, refusal, self.app.translate)

    def ui_action(self, action, row=None, value=None):
        if action != ACTION_SELL or not self.enabled_in_hangar() or self.busy:
            return None
        sale, refusal = self._plan()
        if sale is None:
            return self.notice_error('depot_seller_refused_%s' % refusal)
        if signature(sale) != self.shown:
            return self.notice_error('depot_seller_refused_%s' % REFUSE_CHANGED)

        self.busy = True
        sell(sale, tankmen_by_id([member['inv_id'] for member in sale['crew']]), self._done)
        return self.notice_info('depot_seller_sent')

    @safe
    def _done(self, success):
        self.busy = False
        if not success:
            self.app.ui.notify(self.app.translate('depot_seller_failed'))
