from __future__ import absolute_import, division, print_function, unicode_literals

import json
import time

from ....core.client.component import FeatureComponent
from ....core.client.game import on_vehicle_changed, selected_tank_id
from ....core.log import log, safe
from ....core.vendor import six
from .. import FEATURE_ID
from ..i18n import STRINGS
from ..model import AdviceCache, advice_path, advised_ids, page_payload, parse_advice
from ..model.constants import HTTP_OK
from ..settings import SCHEMA, SECTION, SWITCH
from .inject import SetupInjector


class PresetAdvisor(FeatureComponent):

    def __init__(self, app, clock=time.time):
        FeatureComponent.__init__(self, app, SECTION, SCHEMA, SWITCH, STRINGS)
        self.clock = clock
        self.cache = AdviceCache()
        self.injector = SetupInjector(self.payload)
        self.injector.install()
        on_vehicle_changed(self.refresh, FEATURE_ID)
        app.bus.on('hangar', self.refresh)

    def settings_changed(self, changed):
        self.refresh()

    def payload(self):
        tank_id = selected_tank_id()
        items = []
        if self.enabled_in_hangar() and tank_id:
            items = advised_ids(self.cache.get(tank_id), self.settings.to_dict())
        return page_payload(tank_id, items, self.app.translate('preset_advisor_badge'))

    @safe
    def refresh(self, *args):
        tank_id = selected_tank_id()
        now = self.clock()
        if self.enabled_in_hangar() and tank_id and self.cache.is_due(tank_id, now):
            self.cache.asking(tank_id, now)
            self._ask(tank_id)
        self.injector.push(self.payload())

    def _ask(self, tank_id):
        app = self.app
        headers = {'Accept': 'application/json', 'User-Agent': app.user_agent()}

        @safe
        def on_answer(status, body, response_headers=None):
            self._on_answer(tank_id, status, body)

        app.transport.request('GET', app.config.endpoint(advice_path(tank_id)), headers, None, on_answer)

    def _on_answer(self, tank_id, status, body):
        if status != HTTP_OK:
            log('preset advisor: the site answered %s for tank %s' % (status, tank_id))
            return
        try:
            data = json.loads(six.ensure_text(body or b'', 'utf-8'))
        except ValueError:
            data = None
        advice = parse_advice(data, tank_id)
        if advice is None:
            log('preset advisor: an unexpected answer for tank %s' % tank_id)
            return
        self.cache.put(tank_id, advice, self.clock())
        if tank_id == selected_tank_id():
            self.injector.push(self.payload())
