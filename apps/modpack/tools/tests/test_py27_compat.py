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


CLIENT_ONLY = ('BigWorld', 'gui', 'PlayerEvents', 'CurrentVehicle', 'BattleReplay', 'BattleFeedbackCommon', 'dossiers2', 'AccountCommands',
               'items', 'helpers', 'ArenaType', 'skeletons', 'constants', 'SoundGroups')
PY3 = sys.version_info[0] >= 3


def source_files():
    return list(_support.source_files())


def relative(path):
    return os.path.relpath(path, _support.MODPACK_DIR).replace(os.sep, '/')


def is_client_glue(path):
    parts = relative(path).split('/')
    return 'client' in parts[:-1] or 'entry' in parts[:-1] or parts[-1] == 'client.py'


def module_name(path):
    parts = relative(path)[:-len('.py')].split('/')
    if parts[0] == 'packages':
        parts = parts[1:]
    if parts[-1] == '__init__':
        parts = parts[:-1]
    return '.'.join([_support.ROOT_PACKAGE] + parts)


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

    def test_sources_compile(self):
        for path in source_files() + _support.vendor_files():
            with io.open(path, 'rb') as handle:
                compile(handle.read(), path, 'exec')

    @unittest.skipUnless(PY3, 'the AST scan needs the Python 3 ast module')
    def test_sources_use_py27_syntax(self):
        problems = []
        for path in source_files():
            with io.open(path, 'r', encoding='utf-8') as handle:
                text = handle.read()
            tree = ast.parse(text, path)
            source = relative(path)
            if any(ord(ch) > 127 for ch in text) and 'coding: utf-8' not in text.splitlines()[0]:
                problems.append('%s: non-ASCII source without coding header' % source)
            for node in ast.walk(tree):
                if isinstance(node, FORBIDDEN_NODES):
                    problems.append('%s:%d: %s' % (source, node.lineno, type(node).__name__))
                if isinstance(node, (ast.FunctionDef, ast.Lambda)):
                    args = node.args
                    if args.kwonlyargs or getattr(args, 'posonlyargs', []):
                        problems.append('%s:%d: keyword-only/positional-only args' % (source, node.lineno))
                    if isinstance(node, ast.FunctionDef):
                        if node.returns is not None or any(a.annotation is not None for a in args.args):
                            problems.append('%s:%d: annotations' % (source, node.lineno))
                if isinstance(node, ast.Starred) and not isinstance(getattr(node, 'ctx', None), ast.Load):
                    problems.append('%s:%d: extended unpacking' % (source, node.lineno))
                if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'print':
                    if 'print_function' not in text:
                        problems.append('%s:%d: print() without __future__ import' % (source, node.lineno))
                if isinstance(node, (ast.Import, ast.ImportFrom)) and not getattr(node, 'level', 0):
                    names = [node.module] if isinstance(node, ast.ImportFrom) else [a.name for a in node.names]
                    for module in names:
                        if module in PY3_ONLY_MODULES and not guarded(tree, node):
                            problems.append('%s:%d: unguarded py3-only import %s' % (source, node.lineno, module))
                if isinstance(node, ast.Constant) and isinstance(node.value, bytes) and any(b > 127 for b in node.value):
                    problems.append('%s:%d: non-ASCII bytes literal' % (source, node.lineno))
        self.assertEqual(problems, [])

    @unittest.skipUnless(PY3, 'the AST scan needs the Python 3 ast module')
    def test_client_modules_are_isolated(self):
        problems = []
        for path in source_files():
            if is_client_glue(path):
                continue
            with io.open(path, 'r', encoding='utf-8') as handle:
                tree = ast.parse(handle.read(), path)
            for node in ast.walk(tree):
                if isinstance(node, (ast.Import, ast.ImportFrom)):
                    names = [node.module or ''] if isinstance(node, ast.ImportFrom) else [a.name for a in node.names]
                    for name in names:
                        if name.split('.')[0] in CLIENT_ONLY and getattr(node, 'level', 0) == 0:
                            problems.append('%s imports %s' % (relative(path), name))
        self.assertEqual(problems, [])

    def test_pure_modules_import_without_client(self):
        import importlib
        names = [module_name(path) for path in source_files() if not is_client_glue(path)]
        self.assertIn('otmetki.core.net.signing', names)
        self.assertIn('otmetki.features.replay_upload.model', names)
        for name in names:
            importlib.import_module(name)
        self.assertNotIn('BigWorld', sys.modules)

if __name__ == '__main__':
    unittest.main()
