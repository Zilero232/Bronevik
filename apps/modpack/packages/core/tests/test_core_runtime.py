# -*- coding: utf-8 -*-
import itertools
import os
import shutil
import tempfile
import unittest

import _support  # noqa: F401
from otmetki.core import hooks, registry
from otmetki.core.events import EventBus
from otmetki.core.i18n import Catalog, Translator, resolve_language
from otmetki.core.format import format_number, format_percent
from otmetki.core.settings import Schema, Settings
from otmetki.core.storage import JsonFile


class FakeEvent(object):
    """The client's Event: += and -= handlers, calling it fires them."""

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


class RegistryTest(unittest.TestCase):
    """The client imports mod_*.pyc in hash order: any order of host start and feature entries must end
    with every feature attached exactly once to the one host."""

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
            # A second import of an entry, or a second host start, changes nothing.
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

    def test_number(self):
        self.assertEqual(format_number(1234567.4), u'1 234 567')
        self.assertEqual(format_number(None), u'-')
        self.assertEqual(format_percent(60), u'60.00%')


if __name__ == '__main__':
    unittest.main()
