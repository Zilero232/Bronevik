"""Run every modpack unittest suite: packages/*/tests, features/*/tests and tools/**/tests.

Works on Python 3 and on Python 2.7 with no third-party packages; `pytest` runs the same tests
(see pyproject.toml). The build tool's own tests need Python 3 and are left out on Python 2.7.
Usage: python tools/run_tests.py [-v]
"""
import os
import sys
import unittest

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
MODPACK_DIR = os.path.dirname(TOOLS_DIR)
PY3 = sys.version_info[0] >= 3
sys.path.insert(0, os.path.join(TOOLS_DIR, 'testing'))

import _support  # noqa: E402  (maps the repo layout onto the otmetki package)


def python3_only(directory):
    """The build tooling (tools/build/**) needs Python 3."""
    return directory.startswith(os.path.join(TOOLS_DIR, 'build'))


def test_dirs():
    dirs = [os.path.join(base, 'tests') for base in _support.source_dirs()]
    for directory, children, _ in os.walk(TOOLS_DIR):
        children[:] = sorted(child for child in children if child != '__pycache__')
        if os.path.basename(os.path.dirname(directory)) == 'tests' or os.path.basename(directory) == 'tests':
            if PY3 or not python3_only(directory):
                dirs.append(directory)
    return [directory for directory in dirs if os.path.isdir(directory) and any(name.startswith('test_') for name in os.listdir(directory))]


def main(argv):
    seen = {}
    suite = unittest.TestSuite()
    for directory in test_dirs():
        for name in sorted(os.listdir(directory)):
            if name.startswith('test_') and name.endswith('.py'):
                if name in seen:
                    sys.stderr.write('duplicate test module name %s in %s and %s\n' % (name, seen[name], directory))
                    return 2
                seen[name] = directory
        suite.addTests(unittest.TestLoader().discover(directory, pattern='test_*.py', top_level_dir=directory))
    verbosity = 2 if '-v' in argv else 1
    result = unittest.TextTestRunner(verbosity=verbosity).run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
