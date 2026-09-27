import json
import os
import shutil
import tempfile
import unittest

import _support
from otmetki.companion.binding import Credentials
from otmetki.companion.config import Config
from otmetki.companion.settings_share import (POLL_PATH, RESULT_PATH, SettingsBackup, SettingsShareError, backup_path, build_export,
                                    build_export_request, build_poll_request, build_result_request, changes_to_values,
                                    flatten_settings, parse_poll_response, plan_apply, result_path, signed_post)
from otmetki.core.net.signing import DEVICE_HEADER, verify_request
from otmetki.core.storage import JsonFile, MemoryFile

SECRET = 'q' * 43
CREDS = Credentials('dev_1', SECRET, 7, 1)
REQUEST_ID = '0b5e4f9e-4c1a-4d8e-9a3b-2f6c1d0e7a11'

MINE = {
    'resolution': '1920x1080',
    'refreshRate': 144,
    'windowMode': 'fullscreen',
    'graphicsPreset': 'high',
    'fov': 95,
    'arcadeSens': 0.5,
    'sniperSens': 0.3,
    'zoomSteps': ['x2', 'x4', 'x8'],
    'volumeMaster': 80,
}

CREATOR = {
    'display': {'resolution': '2560x1440', 'refreshRate': 240, 'windowMode': 'borderless', 'preset': 'low'},
    'camera': {'fov': 110},
    'controls': {'sensitivity': {'arcade': 0.8, 'sniper': 0.2}, 'invert': False},
    'zoom': {'steps': ['x2', 'x4', 'x8', 'x16', 'x25']},
    'sound': {'master': 50},
}


def validator(definition):
    return _support.schema_validator('settings.schema.json', definition)


class ExportTest(unittest.TestCase):

    def test_maps_to_contract_groups(self):
        settings = build_export(dict(MINE, dynamicFov=[80, 110], enemyMarkers=['hpBar', 'tier'], graphicsOverrides={'shadows': 'off', 'x': 'y'}))
        self.assertEqual(settings['display'], {'resolution': '1920x1080', 'refreshRate': 144, 'windowMode': 'fullscreen', 'preset': 'high',
                                               'overrides': {'shadows': 'off'}})
        self.assertEqual(settings['camera'], {'fov': 95, 'dynamicFov': [80, 110]})
        self.assertEqual(settings['controls'], {'sensitivity': {'arcade': 0.5, 'sniper': 0.3}})
        self.assertEqual(settings['zoom'], {'steps': ['x2', 'x4', 'x8']})
        self.assertEqual(settings['markers'], {'enemy': {'base': ['hpBar', 'tier']}})
        self.assertEqual(settings['sound'], {'master': 80})

    def test_whitelist_drops_personal_unknown_and_invalid(self):
        raw = dict(MINE, login='player@mail.ru', password='x', token='abc', loginPage={'login': 'me'}, account_id=7, databaseID=7,
                   gpu='RTX 4090', cpu='i9', mouseDpi=1600, modpack='Jove', mods=['xvm'], hardware={'gpu': 'x'},
                   fov=200, sniperSens=5.0, zoomSteps=['x2', 'x100'], vsync='yes', resolution='big')
        settings = build_export(raw)
        text = json.dumps(settings)
        for leaked in ('player@mail.ru', 'login', 'token', 'password', 'RTX', 'i9', '1600', 'Jove', 'xvm'):
            self.assertNotIn(leaked, text)
        self.assertNotIn('hardware', settings)
        self.assertNotIn('mods', settings)
        self.assertNotIn('fov', settings.get('camera', {}))
        self.assertEqual(settings['controls'], {'sensitivity': {'arcade': 0.5}})
        self.assertNotIn('zoom', settings)
        self.assertNotIn('resolution', settings['display'])

    def test_flatten_is_inverse(self):
        self.assertEqual(flatten_settings(build_export(MINE)), MINE)
        self.assertEqual(flatten_settings({'hardware': {'gpu': 'x'}, 'mods': {'kind': 'clean'}, 'camera': 'bad'}), {})


class PlanApplyTest(unittest.TestCase):

    def request(self, groups):
        return {'id': REQUEST_ID, 'profile_slug': 'nidin', 'groups': groups, 'settings': CREATOR}

    def test_limited_to_requested_groups(self):
        changes = plan_apply(MINE, self.request(['camera', 'zoom']))
        self.assertEqual(changes, [
            ('camera', 'fov', 95, 110),
            ('zoom', 'steps', ['x2', 'x4', 'x8'], ['x2', 'x4', 'x8', 'x16', 'x25']),
        ])

    def test_resolution_and_sensitivity_excluded_by_default(self):
        fields = [(g, f) for g, f, _, _ in plan_apply(MINE, self.request(['display', 'controls']))]
        self.assertEqual(fields, [('display', 'preset'), ('controls', 'invert')])

    def test_opt_in(self):
        fields = [(g, f) for g, f, _, _ in plan_apply(MINE, self.request(['display', 'controls']), include_resolution=True)]
        self.assertIn(('display', 'resolution'), fields)
        self.assertIn(('display', 'windowMode'), fields)
        self.assertNotIn(('controls', 'sensitivity.sniper'), fields)
        changes = plan_apply(MINE, self.request(['controls']), include_sensitivity=True)
        self.assertIn(('controls', 'sensitivity.arcade', 0.5, 0.8), changes)
        self.assertIn(('controls', 'sensitivity.sniper', 0.3, 0.2), changes)

    def test_no_diff_for_equal_values_and_unknown_groups(self):
        self.assertEqual(plan_apply(dict(MINE, fov=110), self.request(['camera'])), [])
        self.assertEqual(plan_apply(MINE, self.request(['hardware', 'mods'])), [])

    def test_changes_to_values(self):
        changes = plan_apply(MINE, self.request(['camera', 'sound']))
        self.assertEqual(changes_to_values(changes), {'fov': 110, 'volumeMaster': 50})


class BackupTest(unittest.TestCase):

    def test_round_trip_on_disk(self):
        directory = tempfile.mkdtemp()
        try:
            path = backup_path(os.path.join(directory, 'otmetki'), 7)
            self.assertTrue(path.endswith('settings_backup_7.json'))
            backup = SettingsBackup(JsonFile(path))
            self.assertFalse(backup.has())
            changes = plan_apply(MINE, {'groups': ['camera', 'sound'], 'settings': CREATOR})
            backup.save(MINE, changes, REQUEST_ID, 100)
            self.assertEqual(SettingsBackup(JsonFile(path)).values(), {'fov': 95, 'volumeMaster': 80})
            backup.clear()
            self.assertFalse(os.path.exists(path))
            self.assertEqual(backup.values(), {})
        finally:
            shutil.rmtree(directory)

    def test_second_apply_keeps_original_values(self):
        backup = SettingsBackup(MemoryFile())
        first = plan_apply(MINE, {'groups': ['camera'], 'settings': CREATOR})
        backup.save(MINE, first, 'a', 1)
        after = dict(MINE, fov=110)
        second = plan_apply(after, {'groups': ['camera', 'zoom'], 'settings': {'camera': {'fov': 100}, 'zoom': {'steps': ['x2']}}})
        backup.save(after, second, 'b', 2)
        self.assertEqual(backup.values(), {'fov': 95, 'zoomSteps': ['x2', 'x4', 'x8']})

    def test_corrupt_backup_is_ignored(self):
        self.assertEqual(SettingsBackup(MemoryFile({'values': {'login': 'me', 'fov': 500, 'vsync': True}})).values(), {'vsync': True})
        self.assertFalse(SettingsBackup(MemoryFile('junk')).has())


class PayloadTest(unittest.TestCase):

    def test_export_request(self):
        payload = build_export_request(CREDS, '0.4.0', 'private', True, MINE)
        self.assertEqual(sorted(payload.keys()), ['account_id', 'anonymous_stats', 'device_id', 'mod_version', 'settings', 'target'])
        self.assertEqual(payload['device_id'], 'dev_1')
        self.assertEqual(payload['account_id'], 7)
        self.assertTrue(payload['anonymous_stats'])
        self.assertEqual(payload['settings'], build_export(MINE))
        check = validator('export')
        if check is not None:
            self.assertEqual(list(check.iter_errors(payload)), [])

    def test_export_errors(self):
        for args, reason in (
            ((CREDS, '0.4.0', 'public', False, MINE), 'bad_target'),
            ((CREDS, '0.4.0', 'profile', False, {'login': 'x'}), 'empty'),
            ((None, '0.4.0', 'profile', False, MINE), 'not_bound'),
            ((Credentials('dev', 'short', 7), '0.4.0', 'profile', False, MINE), 'not_bound'),
        ):
            with self.assertRaises(SettingsShareError) as ctx:
                build_export_request(*args)
            self.assertEqual(ctx.exception.reason, reason)

    def test_poll_and_result(self):
        self.assertEqual(build_poll_request(CREDS), {'device_id': 'dev_1', 'account_id': 7})
        self.assertEqual(build_result_request(CREDS, 'rejected'), {'device_id': 'dev_1', 'account_id': 7, 'status': 'rejected'})
        with self.assertRaises(SettingsShareError):
            build_result_request(CREDS, 'expired')
        self.assertEqual(result_path(REQUEST_ID), RESULT_PATH % REQUEST_ID)
        with self.assertRaises(SettingsShareError):
            result_path('../../admin')
        for name, payload in (('deviceRequest', build_poll_request(CREDS)), ('result', build_result_request(CREDS, 'applied'))):
            check = validator(name)
            if check is not None:
                self.assertEqual(list(check.iter_errors(payload)), [])

    def test_parse_poll_response(self):
        data = {'requests': [
            {'id': REQUEST_ID, 'profile_slug': 'nidin', 'groups': ['camera', 'mods'],
             'settings': dict(CREATOR, hardware={'gpu': 'x'}, mods={'kind': 'modpack'})},
            {'id': 'not-a-uuid', 'groups': ['camera'], 'settings': {}},
            {'id': REQUEST_ID, 'groups': ['hardware'], 'settings': {}},
            'junk',
        ]}
        check = validator('pollResponse')
        if check is not None:
            clean = {'id': REQUEST_ID, 'profile_slug': 'nidin', 'groups': ['camera'], 'settings': CREATOR}
            self.assertEqual(list(check.iter_errors({'requests': [clean]})), [])
        requests = parse_poll_response(data)
        self.assertEqual(len(requests), 1)
        self.assertEqual(requests[0]['groups'], ['camera'])
        self.assertNotIn('hardware', requests[0]['settings'])
        self.assertNotIn('mods', requests[0]['settings'])
        self.assertEqual(parse_poll_response({'requests': 'x'}), [])
        self.assertEqual(parse_poll_response(None), [])

    def test_signed_like_ingest(self):
        transport = _support.FakeTransport()
        calls = []
        signed_post(transport, 'https://api.example' + POLL_PATH, CREDS, build_poll_request(CREDS), 'ua', lambda *a: calls.append(a))
        request = transport.requests[0]
        self.assertEqual(request['method'], 'POST')
        self.assertEqual(request['headers'][DEVICE_HEADER], 'dev_1')
        self.assertTrue(verify_request(SECRET, 'POST', 'https://api.example' + POLL_PATH, request['headers'], request['body']))
        transport.respond(204)
        self.assertEqual(calls, [(204, b'', {})])


class ConfigSwitchTest(unittest.TestCase):

    def test_feature_switch_and_choices(self):
        config = Config()
        self.assertTrue(config.is_enabled('share_settings'))
        self.assertEqual(config.get('settings_target'), 'private')
        self.assertFalse(config.get('settings_anonymous_stats'))
        self.assertFalse(config.get('settings_include_resolution'))
        self.assertFalse(config.get('settings_include_sensitivity'))
        config.update({'share_settings': False, 'settings_target': 'everyone', 'settings_action': 'rm -rf'})
        self.assertFalse(config.is_enabled('share_settings'))
        self.assertEqual(config.get('settings_target'), 'private')
        self.assertEqual(config.get('settings_action'), '')
        config.update({'settings_target': 'profile', 'settings_action': 'export'})
        self.assertEqual(config.get('settings_target'), 'profile')
        self.assertEqual(config.get('settings_action'), 'export')


if __name__ == '__main__':
    unittest.main()
