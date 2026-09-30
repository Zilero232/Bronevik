# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import importlib
import itertools
import os
import shutil
import sys
import tempfile
import types
import unittest

import _support  # noqa: F401
from otmetki.core import hooks, log, registry
from otmetki.core.client.game import values_by_name
from otmetki.core.errors import ReasonError
from otmetki.core.events import EventBus
from otmetki.core.i18n import Catalog, Translator, resolve_language
from otmetki.core.format import format_number, format_percent, single_spaces, strip_tags
from otmetki.core.settings import Schema, Settings
from otmetki.core.storage import JsonFile, account_file


class FakeEvent(object):

    def __init__(self):
        self.handlers = []

    def __iadd__(self, handler):
        self.handlers.append(handler)
        return self

    def __isub__(self, handler):
        self.handlers.remove(handler)
        return self

    def __call__(self, *args):
        for handler in list(self.handlers):
            handler(*args)


class EventBusTest(unittest.TestCase):

    def test_order_and_isolation(self):
        errors = []
        bus = EventBus(on_error=errors.append)
        calls = []

        def broken(value):
            raise ValueError(value)

        bus.on('x', lambda value: calls.append(('a', value)))
        bus.on('x', broken)
        bus.on('x', lambda value: calls.append(('c', value)))
        bus.emit('x', 1)
        self.assertEqual(calls, [('a', 1), ('c', 1)])
        self.assertEqual(errors, ['x handler'])

    def test_off_and_duplicates(self):
        bus = EventBus()
        calls = []
        handler = calls.append
        bus.on('x', handler)
        bus.on('x', handler)
        bus.emit('x', 1)
        bus.off('x', handler)
        bus.emit('x', 2)
        self.assertEqual(calls, [1])
        self.assertFalse(bus.has('x'))
        bus.emit('nobody', 1)


class HooksTest(unittest.TestCase):

    def test_subscriptions(self):
        class Owner(object):
            onChanged = FakeEvent()

        calls = []
        subscriptions = hooks.Subscriptions()
        subscriptions.add(Owner, 'onChanged', calls.append)
        Owner.onChanged(1)
        subscriptions.clear()
        Owner.onChanged(2)
        self.assertEqual(calls, [1])

    def test_override_method_and_restore(self):
        class Target(object):
            def greet(self, name):
                return 'hi ' + name

        @hooks.override(Target, 'greet')
        def greet(original, self, name):
            return original(self, name).upper()

        self.assertEqual(Target().greet('a'), 'HI A')
        self.assertTrue(hooks.restore(Target, 'greet'))
        self.assertEqual(Target().greet('a'), 'hi a')
        self.assertFalse(hooks.restore(Target, 'greet'))

    def test_override_inherited_and_static(self):
        class Base(object):
            def value(self):
                return 1

            @staticmethod
            def twice(x):
                return 2 * x

        class Child(Base):
            pass

        hooks.override(Child, 'value')(lambda original, self: original(self) + 10)
        hooks.override(Child, 'twice')(lambda original, x: original(x) + 1)
        self.assertEqual(Child().value(), 11)
        self.assertEqual(Child().twice(3), 7)
        self.assertEqual(Base().value(), 1)
        self.assertTrue(hooks.restore(Child, 'value'))
        self.assertTrue(hooks.restore(Child, 'twice'))
        self.assertEqual(Child().value(), 1)
        self.assertEqual(Child.twice(3), 6)
        self.assertNotIn('value', Child.__dict__)


class HookGuardTest(unittest.TestCase):

    def setUp(self):
        self.logged = []
        self.saved = hooks.log_exception, log.log_exception
        hooks.log_exception = log.log_exception = self.logged.append

    def tearDown(self):
        hooks.log_exception, log.log_exception = self.saved

    def test_a_failing_subscriber_is_logged_and_the_rest_still_run(self):
        class Owner(object):
            onChanged = FakeEvent()

        calls = []

        def broken(value):
            raise RuntimeError(value)

        guarded = hooks.subscribe(Owner, 'onChanged', broken)
        hooks.subscribe(Owner, 'onChanged', calls.append)
        Owner.onChanged(1)
        self.assertEqual(calls, [1])
        self.assertEqual(len(self.logged), 1)
        self.assertTrue(hooks.unsubscribe(Owner, 'onChanged', guarded))
        self.assertEqual(len(Owner.onChanged.handlers), 1)

    def test_override_failing_before_the_original_calls_it(self):
        class Target(object):
            def value(self):
                return 7

        def broken(original, target):
            raise RuntimeError('before')

        hooks.override(Target, 'value')(broken)
        self.assertEqual(Target().value(), 7)
        self.assertEqual(self.logged, ['override value'])

    def test_override_failing_after_the_original_keeps_its_result(self):
        calls = []

        class Target(object):
            def value(self):
                calls.append(1)
                return 7

        def broken(original, target):
            original(target)
            raise RuntimeError('after')

        hooks.override(Target, 'value')(broken)
        self.assertEqual(Target().value(), 7)
        self.assertEqual(calls, [1])

    def test_override_lets_the_original_raise(self):
        class Target(object):
            def value(self):
                raise KeyError('client')

        hooks.override(Target, 'value')(lambda original, target: original(target))
        self.assertRaises(KeyError, Target().value)
        self.assertEqual(self.logged, [])


class TickerTest(unittest.TestCase):

    def setUp(self):
        self.callbacks = []
        self.saved = dict((name, sys.modules.get(name)) for name in ('BigWorld', 'otmetki.core.client.timer'))
        stub = types.ModuleType(str('BigWorld'))
        stub.callback = lambda delay, fn: self.callbacks.append(fn)
        sys.modules['BigWorld'] = stub
        sys.modules.pop('otmetki.core.client.timer', None)
        self.timer = importlib.import_module('otmetki.core.client.timer')
        self.saved_log = self.timer.log_exception
        self.timer.log_exception = lambda context: None

    def tearDown(self):
        self.timer.log_exception = self.saved_log
        for name, module in self.saved.items():
            if module is None:
                sys.modules.pop(name, None)
            else:
                sys.modules[name] = module

    def run_callbacks(self):
        pending, self.callbacks = self.callbacks, []
        for callback in pending:
            callback()

    def test_ticks_until_the_handler_returns_false_and_survives_errors(self):
        ticks = []

        def on_tick():
            ticks.append(1)
            if len(ticks) == 1:
                raise RuntimeError('tick')
            return len(ticks) < 3

        ticker = self.timer.Ticker(1.0, on_tick)
        ticker.start()
        for _ in range(5):
            self.run_callbacks()
        self.assertEqual(len(ticks), 3)
        self.assertFalse(ticker.running)

    def test_a_restart_never_runs_two_chains(self):
        ticks = []
        ticker = self.timer.Ticker(1.0, lambda: ticks.append(1))
        ticker.start()
        ticker.stop()
        ticker.start()
        self.run_callbacks()
        self.run_callbacks()
        self.assertEqual(len(ticks), 2)

    def test_elapsed_is_the_game_time_between_ticks(self):
        clock = [10.0]
        sys.modules['BigWorld'].time = lambda: clock[0]
        seen = []
        ticker = self.timer.Ticker(0.1, lambda: seen.append(round(ticker.elapsed(), 3)))
        ticker.start()
        clock[0] = 10.133
        self.run_callbacks()
        clock[0] = 10.25
        self.run_callbacks()
        self.assertEqual(seen, [0.133, 0.117])
        clock[0] = 10.3
        ticker.restart_elapsed()
        clock[0] = 10.35
        self.run_callbacks()
        self.assertEqual(seen[-1], 0.05)

    def test_elapsed_falls_back_to_the_interval_without_a_clock(self):
        seen = []
        ticker = self.timer.Ticker(0.5, lambda: seen.append(ticker.elapsed()))
        ticker.start()
        self.run_callbacks()
        self.assertEqual(seen, [0.5])


class CoreHelpersTest(unittest.TestCase):

    def test_values_by_name_skips_names_the_client_lacks(self):
        holder = type(str('KINDS'), (object,), {'DAMAGE': 1, 'TANKING': 7})
        self.assertEqual(values_by_name(holder, (('DAMAGE', 'damage'), ('STUN', 'stun'), ('TANKING', 'blocked'))), {1: 'damage', 7: 'blocked'})
        self.assertEqual(values_by_name(None, (('DAMAGE', 'damage'),)), {})

    def test_text_helpers(self):
        self.assertEqual(strip_tags(u'<font color="#fff">a</font>b', u' '), u' a b')
        self.assertEqual(single_spaces(u'  a \n\t b  '), u'a b')

    def test_reason_error(self):
        error = ReasonError('code')
        self.assertEqual(error.reason, 'code')
        self.assertIsInstance(error, ValueError)


class RegistryTest(unittest.TestCase):

    def setUp(self):
        self.saved = registry.log, registry.log_exception
        registry.log = registry.log_exception = lambda message: None
        registry.reset()

    def tearDown(self):
        registry.log, registry.log_exception = self.saved
        registry.reset()

    def test_any_init_order(self):
        feature_ids = ('marks_panel', 'session_stats', 'replay_upload')
        for order in itertools.permutations(['host'] + list(feature_ids)):
            registry.reset()
            host = object()
            created = []

            def factory_for(feature_id):
                def factory(app):
                    created.append((feature_id, app))
                    return feature_id
                return factory

            for step in order:
                if step == 'host':
                    self.assertTrue(registry.registry().bind(host))
                else:
                    self.assertTrue(registry.registry().register(step, factory_for(step)))
            self.assertFalse(registry.registry().register('marks_panel', factory_for('marks_panel')))
            self.assertTrue(registry.registry().bind(host))
            self.assertFalse(registry.registry().bind(object()))
            self.assertEqual(sorted(created), sorted((feature_id, host) for feature_id in feature_ids), order)
            for feature_id in feature_ids:
                self.assertEqual(registry.registry().get(feature_id), feature_id)

    def test_failing_feature_does_not_block_others(self):
        def broken(app):
            raise RuntimeError('boom')

        registry.registry().register('broken', broken)
        registry.registry().register('fine', lambda app: 'ok')
        registry.registry().bind(object())
        self.assertIsNone(registry.registry().get('broken'))
        self.assertEqual(registry.registry().get('fine'), 'ok')

    def test_lazy_singleton(self):
        self.assertIs(registry.registry(), registry.registry())


class SettingsSchemaTest(unittest.TestCase):

    def test_coerce(self):
        schema = Schema({'on': True, 'count': 5, 'mode': 'a', 'url': 'x'}, choices={'mode': ('a', 'b')}, limits={'count': (1, 9)},
                        normalizers={'url': lambda value: value.upper() if value.startswith('h') else None})
        settings = Settings({'on': 'yes', 'count': 99.5, 'mode': 'c', 'url': ' http ', 'other': 1}, schema=schema)
        self.assertEqual(settings.to_dict(), {'on': True, 'count': 9, 'mode': 'a', 'url': 'HTTP'})
        self.assertEqual(settings.update({'mode': 'b', 'url': 'ftp'}), ['mode'])
        self.assertFalse(Settings({'on': False}, schema=schema).is_enabled('on'))


class I18nCatalogTest(unittest.TestCase):

    def test_catalog(self):
        catalog = Catalog({'ru': {'a': u'А'}, 'en': {'a': u'A'}}, {'ru': {'b': u'Б {x}'}})
        self.assertEqual(Translator(catalog, 'en')('b', x=1), u'Б 1')
        self.assertEqual(Translator(catalog, 'en')('missing'), u'missing')
        self.assertEqual(Translator(catalog, 'de').language, 'ru')
        self.assertEqual(resolve_language(catalog, 'auto', 'uk'), 'ru')
        self.assertEqual(resolve_language(catalog, 'auto', 'en_US'), 'en')


class StorageAndPanelsTest(unittest.TestCase):

    def test_json_file_roundtrip(self):
        directory = tempfile.mkdtemp()
        try:
            path = os.path.join(directory, 'nested', 'config.json')
            storage = JsonFile(path, pretty=True)
            self.assertEqual(storage.read({}), {})
            storage.write({'a': u'Три отметки'})
            storage.write({'a': u'Три отметки', 'b': 2})
            self.assertEqual(JsonFile(path).read(), {'a': u'Три отметки', 'b': 2})
            with open(path, 'w') as handle:
                handle.write('{broken')
            self.assertEqual(JsonFile(path).read('fallback'), 'fallback')
        finally:
            shutil.rmtree(directory)

    def test_account_file_names_one_account_per_file(self):
        stored = account_file(os.path.join('configs', 'otmetki'), 'hits_%d.json', 12345)
        self.assertEqual(stored.path, os.path.join('configs', 'otmetki', 'hits_12345.json'))
        self.assertFalse(stored.pretty)

    def test_number(self):
        self.assertEqual(format_number(1234567.4), u'1 234 567')
        self.assertEqual(format_number(None), u'-')
        self.assertEqual(format_percent(60), u'60.00%')


if __name__ == '__main__':
    unittest.main()
