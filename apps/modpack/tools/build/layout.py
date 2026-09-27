"""What goes into each package: the in-game path of every source file.

In the client every package lands in the same tree, res/scripts/client/gui/mods/:

    otmetki/__init__.py, otmetki/core/**, otmetki/features/__init__.py   <- core
    mod_otmetki.py, otmetki/companion/**                                  <- companion
    mod_otmetki_<id>.py, otmetki/features/<id>/**                         <- feature <id>

so the split packages never ship the same file, and the single package is their union.
"""
import os
import re

MODPACK_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PACKAGES_DIR = os.path.join(MODPACK_DIR, 'packages')
FEATURES_DIR = os.path.join(MODPACK_DIR, 'features')
MODS_ROOT = 'res/scripts/client/gui/mods'
PACKAGE_ROOT = MODS_ROOT + '/otmetki'
SKIPPED_DIRS = ('tests', 'entry', '__pycache__')
ROOT_INIT = '"""Three Marks: the core, companion and features/<id> packages share this namespace."""\n'
DESCRIPTIONS = {
    'core': 'Three Marks core runtime for the companion and its features (triotmetki.ru)',
    'companion': 'Three Marks companion: own battle results, marks of excellence and session stats for triotmetki.ru',
}


class Package(object):

    def __init__(self, key, package_id, name, version, description, files, depends=()):
        self.key = key
        self.package_id = package_id
        self.name = name
        self.version = version
        self.description = description
        self.files = files
        self.depends = tuple(depends)


def read_constants(path, names):
    with open(path, encoding='utf-8') as handle:
        text = handle.read()
    pattern = r"^(%s) = '([^']+)'" % '|'.join(names)
    values = dict(re.findall(pattern, text, re.M))
    missing = [name for name in names if name not in values]
    if missing:
        raise SystemExit('%s: missing %s' % (path, ', '.join(missing)))
    return [values[name] for name in names]


def tree(base, archive_base):
    """(source path, archive path) for every .py under base; tests and entry scripts are left out."""
    for directory, dirs, files in os.walk(base):
        dirs[:] = sorted(d for d in dirs if d not in SKIPPED_DIRS)
        for name in sorted(files):
            if name.endswith('.py'):
                path = os.path.join(directory, name)
                relative = os.path.relpath(path, base).replace(os.sep, '/')
                yield path, archive_base + '/' + relative


def entries(base):
    """The mod_*.py entry scripts the client auto-loads from gui/mods/."""
    entry_dir = os.path.join(base, 'entry')
    if not os.path.isdir(entry_dir):
        return []
    return [(os.path.join(entry_dir, name), MODS_ROOT + '/' + name) for name in sorted(os.listdir(entry_dir)) if name.endswith('.py')]


def feature_ids():
    return sorted(name for name in os.listdir(FEATURES_DIR) if os.path.isfile(os.path.join(FEATURES_DIR, name, '__init__.py')))


def core_package(root_init):
    """`root_init` is the path of the generated otmetki/__init__.py (the build writes ROOT_INIT there)."""
    base = os.path.join(PACKAGES_DIR, 'core')
    package_id, name, version = read_constants(os.path.join(base, 'version.py'), ('PACKAGE_ID', 'PACKAGE_NAME', 'VERSION'))
    files = [(root_init, PACKAGE_ROOT + '/__init__.py')]
    files += list(tree(base, PACKAGE_ROOT + '/core'))
    files.append((os.path.join(FEATURES_DIR, '__init__.py'), PACKAGE_ROOT + '/features/__init__.py'))
    return Package('core', package_id, name, version, DESCRIPTIONS['core'], files)


def companion_package(core):
    base = os.path.join(PACKAGES_DIR, 'companion')
    package_id, name, version = read_constants(os.path.join(base, 'version.py'), ('MOD_ID', 'MOD_NAME', 'VERSION'))
    files = entries(base) + list(tree(base, PACKAGE_ROOT + '/companion'))
    return Package('companion', package_id, name, version, DESCRIPTIONS['companion'], files, [core])


def feature_package(feature_id, core, companion):
    base = os.path.join(FEATURES_DIR, feature_id)
    package_id, name, version = read_constants(os.path.join(base, '__init__.py'), ('PACKAGE_ID', 'PACKAGE_NAME', 'VERSION'))
    files = entries(base) + list(tree(base, PACKAGE_ROOT + '/features/' + feature_id))
    return Package(feature_id, package_id, name, version, name + ' (triotmetki.ru)', files, [core, companion])


def split_packages(root_init):
    core = core_package(root_init)
    companion = companion_package(core)
    return [core, companion] + [feature_package(feature_id, core, companion) for feature_id in feature_ids()]


def single_package(root_init):
    """Everything in one package under the companion's id: the pre-split release format."""
    packages = split_packages(root_init)
    companion = packages[1]
    files = [item for package in packages for item in package.files]
    return Package('single', companion.package_id, companion.name, companion.version, companion.description, files)
