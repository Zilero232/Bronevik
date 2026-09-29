from __future__ import absolute_import, division, print_function, unicode_literals

from ...core.compat import string_types, to_text
from ...core.hud import EVENT_RESET_LAYOUT
from ...core.log import log
from ..components import COMPANION_ACTIONS, COMPANION_ID, build_catalog, find
from ..fields import Labels
from ..hud_edit import HudEditor, move_values
from ..profiles import ProfileError, apply_snapshot, decode_profile, encode_profile, take_snapshot
from ..protocol import ProtocolError, decode_message
from .companion import CompanionActions
from .constants import CONFIG_COMPONENT, EVENT_COMPONENT_SETTINGS, LANGUAGE_CHOICES, LANGUAGES, NOTICE_CODE, NOTICE_ERROR, NOTICE_INFO
from .links import site_link, site_url


class SettingsBridge(object):

    def __init__(self, context):
        self.context = context
        self.editor = HudEditor(context.bus, context.layer)
        self.companion = CompanionActions(context.config, self.labels)
        self.notice = None
        self.revision = 0
        self.handlers = {
            'ready': self._on_ready,
            'close': self._on_close,
            'set': self._on_set,
            'action': self._on_action,
            'language': self._on_language,
            'bind': self._on_bind,
            'open': self._on_open,
            'profile_save': self._on_profile_save,
            'profile_load': self._on_profile_load,
            'profile_rename': self._on_profile_rename,
            'profile_delete': self._on_profile_delete,
            'profile_export': self._on_profile_export,
            'profile_import': self._on_profile_import,
            'hud_edit': self._on_hud_edit,
            'hud_move': self._on_hud_move,
            'hud_reset': self._on_hud_reset,
            'hud_reset_all': self._on_hud_reset_all,
        }

    def labels(self):
        return Labels(self.context.catalog, self.context.language())

    def components(self):
        context = self.context
        return build_catalog(context.config, context.save_config, context.features(), context.component_config, context.layer,
                             companion_instance=self.companion, switch_keys=context.switch_keys)

    def state(self):
        context = self.context
        labels = self.labels()
        profiles = context.profiles
        return {
            'revision': self.revision,
            'language': context.language(),
            'language_setting': context.config.get('language'),
            'languages': list(LANGUAGES),
            'status': context.status(),
            'site': site_url(context.config.get('server_url')),
            'components': [component.describe(labels) for component in self.components()],
            'profiles': {'active': profiles.active, 'items': profiles.items()},
            'hud': {'editing': self.editor.editing, 'panels': self.editor.panels(labels)},
            'notice': self.notice,
        }

    def handle(self, raw):
        self.notice = None
        try:
            message = decode_message(raw)
            self.handlers[message['type']](message)
        except ProtocolError as error:
            self._notice(NOTICE_ERROR, 'error_protocol', reason=error.reason)
        except ProfileError as error:
            self._notice(NOTICE_ERROR, 'error_profile_%s' % error.reason)
        self.revision += 1
        return True

    def _notice(self, kind, key, code=None, **params):
        self.notice = {'kind': kind, 'text': self.labels().text(key, **params), 'code': code}

    def _changed(self, component_id, changed):
        if changed:
            self.context.bus.emit(EVENT_COMPONENT_SETTINGS, component_id, list(changed))

    def _on_ready(self, message):
        log('ui: settings page ready')

    def _on_close(self, message):
        self.editor.set_editing(False)
        self.context.close()

    def _on_set(self, message):
        component = find(self.components(), message['component'])
        key = message['key']
        if component is None or not isinstance(key, string_types) or not component.editable(key):
            raise ProtocolError('unknown_setting')
        changed, kind = component.update(key, message['value'])
        if not changed:
            self._notice(NOTICE_ERROR, 'error_value')
            return
        self._changed(component.id, changed)
        if kind == 'config':
            self.context.config_changed(changed)

    def _on_action(self, message):
        component_id, action = message['component'], message['action']
        if component_id == COMPANION_ID and action in COMPANION_ACTIONS:
            self.context.companion_action(action)
            return
        component = find(self.components(), component_id)
        instance = component.instance if component is not None else None
        if instance is None or not hasattr(instance, 'ui_action'):
            raise ProtocolError('unknown_action')
        notice = instance.ui_action(action, message.get('row'), message.get('value'))
        if isinstance(notice, dict):
            self.notice = {'kind': notice.get('kind', NOTICE_INFO), 'text': notice.get('text'), 'code': None}

    def _on_language(self, message):
        language = message['language']
        if language not in LANGUAGE_CHOICES:
            raise ProtocolError('unknown_language')
        self.context.set_language(language)

    def _on_bind(self, message):
        code = message['code']
        if not isinstance(code, string_types) or not code.strip():
            raise ProtocolError('empty_code')
        self.context.bind(to_text(code).strip())

    def _on_open(self, message):
        url = site_link(self.context.config.get('server_url'), message['path'])
        if url is None:
            raise ProtocolError('unsafe_link')
        self.context.open_url(url)

    def _on_profile_save(self, message):
        snapshot = take_snapshot(self.context.config, self.context.component_config)
        item = self.context.profiles.save(message['name'], snapshot, message.get('id'))
        self._notice(NOTICE_INFO, 'notice_profile_saved', name=item['name'])

    def _on_profile_load(self, message):
        item = self.context.profiles.activate(message['id'])
        context = self.context
        changes = apply_snapshot(item['data'], context.config, context.save_config, context.component_config, context.layer)
        for component_id, changed in sorted(changes.items()):
            self._changed(component_id, changed)
        config_changed = changes.get(CONFIG_COMPONENT) or []
        if config_changed:
            context.config_changed(config_changed)
        if 'language' in config_changed:
            context.set_language(context.config.get('language'))
        self._notice(NOTICE_INFO, 'notice_profile_loaded', name=item['name'])

    def _on_profile_rename(self, message):
        self.context.profiles.rename(message['id'], message['name'])

    def _on_profile_delete(self, message):
        self.context.profiles.delete(message['id'])

    def _on_profile_export(self, message):
        item = self.context.profiles.get(message['id'])
        if item is None:
            raise ProfileError('missing')
        self._notice(NOTICE_CODE, 'notice_profile_code', code=encode_profile(item['name'], item['data']))

    def _on_profile_import(self, message):
        name, snapshot = decode_profile(message['code'])
        wanted = message.get('name') or name or self.labels().text('profile_imported_name')
        item = self.context.profiles.save(wanted, snapshot)
        self._notice(NOTICE_INFO, 'notice_profile_imported', name=item['name'])

    def _on_hud_edit(self, message):
        if self.editor.set_editing(message['active']):
            self.context.hud_editing(self.editor.editing)

    def _on_hud_move(self, message):
        panel_id = message['panel']
        self._changed(panel_id, self.editor.move(panel_id, move_values(message)))

    def _on_hud_reset(self, message):
        panel_id = message['panel']
        self._changed(panel_id, self.editor.reset(panel_id))

    def _on_hud_reset_all(self, message):
        for panel_id in self.editor.panel_ids():
            self._changed(panel_id, self.editor.reset(panel_id))
        self.context.bus.emit(EVENT_RESET_LAYOUT)
        self.context.reset_layout()
