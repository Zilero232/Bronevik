import ast
import io
import os
import sys
import unittest

import _support

FORBIDDEN_NODES = tuple(getattr(ast, name) for name in (
    'JoinedStr', 'AnnAssign', 'AsyncFunctionDef', 'AsyncFor', 'AsyncWith', 'Await', 'YieldFrom',
    'Nonlocal', 'NamedExpr', 'MatchAs', 'Match',
) if hasattr(ast, name))

PY3_ONLY_MODULES = ('urllib.request', 'urllib.error', 'http.server', 'queue', 'configparser', 'pathlib', 'typing', 'enum', 'dataclasses')


def source_files():
    for root, _, files in os.walk(_support.SRC_DIR):
        for name in files:
            if name.endswith('.py'):
                yield os.path.join(root, name)


def guarded(tree, node):
    for parent in ast.walk(tree):
        if not isinstance(parent, ast.Try):
            continue
        if not any(isinstance(h.type, ast.Name) and h.type.id == 'ImportError' for h in parent.handlers):
            continue
        statements = list(parent.body) + [stmt for h in parent.handlers for stmt in h.body]
        if any(node is child for stmt in statements for child in ast.walk(stmt)):
            return True
    return False


class Py27CompatTest(unittest.TestCase):

    def test_sources_use_py27_syntax(self):
        problems = []
        for path in source_files():
            with io.open(path, 'r', encoding='utf-8') as handle:
                text = handle.read()
            tree = ast.parse(text, path)
            relative = os.path.relpath(path, _support.SRC_DIR)
            if any(ord(ch) > 127 for ch in text) and 'coding: utf-8' not in text.splitlines()[0]:
                problems.append('%s: non-ASCII source without coding header' % relative)
            for node in ast.walk(tree):
                if isinstance(node, FORBIDDEN_NODES):
                    problems.append('%s:%d: %s' % (relative, node.lineno, type(node).__name__))
                if isinstance(node, (ast.FunctionDef, ast.Lambda)):
                    args = node.args
                    if args.kwonlyargs or getattr(args, 'posonlyargs', []):
                        problems.append('%s:%d: keyword-only/positional-only args' % (relative, node.lineno))
                    if isinstance(node, ast.FunctionDef):
                        if node.returns is not None or any(a.annotation is not None for a in args.args):
                            problems.append('%s:%d: annotations' % (relative, node.lineno))
                if isinstance(node, ast.Starred) and not isinstance(getattr(node, 'ctx', None), ast.Load):
                    problems.append('%s:%d: extended unpacking' % (relative, node.lineno))
                if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'print':
                    if 'print_function' not in text:
                        problems.append('%s:%d: print() without __future__ import' % (relative, node.lineno))
                if isinstance(node, (ast.Import, ast.ImportFrom)):
                    names = [node.module] if isinstance(node, ast.ImportFrom) else [a.name for a in node.names]
                    for name in names:
                        if name in PY3_ONLY_MODULES and not guarded(tree, node):
                            problems.append('%s:%d: unguarded py3-only import %s' % (relative, node.lineno, name))
                if isinstance(node, ast.Constant) and isinstance(node.value, bytes) and any(b > 127 for b in node.value):
                    problems.append('%s:%d: non-ASCII bytes literal' % (relative, node.lineno))
        self.assertEqual(problems, [])

    def test_client_modules_are_isolated(self):
        client_only = ('BigWorld', 'gui', 'PlayerEvents', 'CurrentVehicle', 'BattleReplay', 'BattleFeedbackCommon', 'dossiers2', 'AccountCommands', 'items', 'helpers', 'ArenaType')
        problems = []
        for path in source_files():
            relative = os.path.relpath(path, _support.SRC_DIR)
            if os.sep + 'client' + os.sep in os.sep + relative or relative == 'mod_otmetki.py':
                continue
            with io.open(path, 'r', encoding='utf-8') as handle:
                tree = ast.parse(handle.read(), path)
            for node in ast.walk(tree):
                if isinstance(node, (ast.Import, ast.ImportFrom)):
                    names = [node.module or ''] if isinstance(node, ast.ImportFrom) else [a.name for a in node.names]
                    for name in names:
                        if name.split('.')[0] in client_only and getattr(node, 'level', 0) == 0:
                            problems.append('%s imports %s' % (relative, name))
        self.assertEqual(problems, [])

    def test_pure_modules_import_without_client(self):
        import importlib
        for name in ('binding', 'compat', 'config', 'i18n', 'jsonutil', 'moe', 'outbox', 'loadout', 'panels', 'payload',
                     'queue_timer', 'replay_upload', 'replays', 'sender', 'session', 'settings_share', 'settings_template', 'signing', 'storage', 'transport', 'version'):
            importlib.import_module('otmetki.' + name)
        self.assertNotIn('BigWorld', sys.modules)


if __name__ == '__main__':
    unittest.main()
