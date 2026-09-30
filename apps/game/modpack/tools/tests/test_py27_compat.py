import ast
import importlib
import io
import os
import sys
import unittest

import _support

FORBIDDEN_NODES = tuple(getattr(ast, name) for name in (
    'JoinedStr', 'AnnAssign', 'AsyncFunctionDef', 'AsyncFor', 'AsyncWith', 'Await', 'YieldFrom',
    'Nonlocal', 'NamedExpr', 'MatchAs', 'Match',
) if hasattr(ast, name))

PY3_ONLY_MODULES = (
    'urllib.request', 'urllib.error', 'http.server', 'queue', 'configparser', 'pathlib', 'typing', 'enum',
    'dataclasses',
)


CLIENT_ONLY = (
    'BigWorld', 'gui', 'PlayerEvents', 'CurrentVehicle', 'BattleReplay', 'BattleFeedbackCommon', 'dossiers2',
    'AccountCommands', 'items', 'helpers', 'ArenaType', 'skeletons', 'constants', 'SoundGroups',
)
PY3 = sys.version_info[0] >= 3


def source_files():
    return list(_support.source_files())


def read_text(path):
    with io.open(path, 'r', encoding='utf-8') as handle:
        return handle.read()


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


def imported_names(node):
    if isinstance(node, ast.ImportFrom):
        return [node.module or '']
    return [alias.name for alias in node.names]


def catches_import_error(try_node):
    return any(isinstance(handler.type, ast.Name) and handler.type.id == 'ImportError' for handler in try_node.handlers)


def guarded(tree, node):
    """Whether `node` sits inside a try/except ImportError (the py3-only import has a py2 fallback)."""
    for parent in ast.walk(tree):
        if not isinstance(parent, ast.Try) or not catches_import_error(parent):
            continue
        statements = list(parent.body) + [statement for handler in parent.handlers for statement in handler.body]
        if any(node is child for statement in statements for child in ast.walk(statement)):
            return True
    return False


def check_forbidden_node(node, tree, text):
    if isinstance(node, FORBIDDEN_NODES):
        return type(node).__name__
    return None


def check_arguments(node, tree, text):
    if not isinstance(node, (ast.FunctionDef, ast.Lambda)):
        return None
    arguments = node.args
    if arguments.kwonlyargs or getattr(arguments, 'posonlyargs', []):
        return 'keyword-only/positional-only args'
    if not isinstance(node, ast.FunctionDef):
        return None
    if node.returns is not None or any(argument.annotation is not None for argument in arguments.args):
        return 'annotations'
    return None


def check_extended_unpacking(node, tree, text):
    if isinstance(node, ast.Starred) and not isinstance(getattr(node, 'ctx', None), ast.Load):
        return 'extended unpacking'
    return None


def check_print(node, tree, text):
    is_print_call = isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'print'
    if is_print_call and 'print_function' not in text:
        return 'print() without __future__ import'
    return None


def check_py3_only_import(node, tree, text):
    if not isinstance(node, (ast.Import, ast.ImportFrom)) or getattr(node, 'level', 0):
        return None
    for module in imported_names(node):
        if module in PY3_ONLY_MODULES and not guarded(tree, node):
            return 'unguarded py3-only import %s' % module
    return None


def check_bytes_literal(node, tree, text):
    if isinstance(node, ast.Constant) and isinstance(node.value, bytes) and any(byte > 127 for byte in node.value):
        return 'non-ASCII bytes literal'
    return None


NODE_CHECKS = (
    check_forbidden_node,
    check_arguments,
    check_extended_unpacking,
    check_print,
    check_py3_only_import,
    check_bytes_literal,
)


def syntax_problems(path):
    text = read_text(path)
    tree = ast.parse(text, path)
    source = relative(path)
    problems = []
    has_non_ascii = any(ord(character) > 127 for character in text)
    if has_non_ascii and 'coding: utf-8' not in text.splitlines()[0]:
        problems.append('%s: non-ASCII source without coding header' % source)
    for node in ast.walk(tree):
        for check in NODE_CHECKS:
            problem = check(node, tree, text)
            if problem:
                problems.append('%s:%d: %s' % (source, node.lineno, problem))
    return problems


def client_imports(path):
    tree = ast.parse(read_text(path), path)
    for node in ast.walk(tree):
        if not isinstance(node, (ast.Import, ast.ImportFrom)) or getattr(node, 'level', 0) != 0:
            continue
        for name in imported_names(node):
            if name.split('.')[0] in CLIENT_ONLY:
                yield name


class Py27CompatTest(unittest.TestCase):

    def test_sources_compile(self):
        for path in source_files() + _support.vendor_files():
            with io.open(path, 'rb') as handle:
                compile(handle.read(), path, 'exec')

    @unittest.skipUnless(PY3, 'the AST scan needs the Python 3 ast module')
    def test_sources_use_py27_syntax(self):
        problems = [problem for path in source_files() for problem in syntax_problems(path)]

        self.assertEqual(problems, [])

    @unittest.skipUnless(PY3, 'the AST scan needs the Python 3 ast module')
    def test_client_modules_are_isolated(self):
        pure = [path for path in source_files() if not is_client_glue(path)]

        problems = ['%s imports %s' % (relative(path), name) for path in pure for name in client_imports(path)]

        self.assertEqual(problems, [])

    def test_pure_modules_import_without_client(self):
        names = [module_name(path) for path in source_files() if not is_client_glue(path)]

        for name in names:
            importlib.import_module(name)

        self.assertIn('otmetki.core.net.signing', names)
        self.assertIn('otmetki.features.replay_upload.model', names)
        self.assertNotIn('BigWorld', sys.modules)


if __name__ == '__main__':
    unittest.main()
