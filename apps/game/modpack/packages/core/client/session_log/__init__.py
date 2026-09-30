"""Opens the mod's own log file for this session (`core.log.open_file`) with a header that says which client and
which of our packages (and their renderers) this session ran with."""
from __future__ import absolute_import, division, print_function, unicode_literals

import os
import sys

from ...log import open_file
from ...log.constants import FILE_NAME
from ..game import client_version
from ..packaging.constants import MODS_ROOT
from .constants import PACKAGE_EXTENSIONS, PACKAGE_PREFIXES


def installed_packages(root=MODS_ROOT):
    """'<client version folder>/<file>' of every package of ours or of our renderers under `root`."""
    found = []
    if not os.path.isdir(root):
        return found
    for folder in sorted(os.listdir(root)):
        path = os.path.join(root, folder)
        if not os.path.isdir(path):
            continue
        for name in sorted(os.listdir(path)):
            if name.startswith(PACKAGE_PREFIXES) and name.endswith(PACKAGE_EXTENSIONS):
                found.append('%s/%s' % (folder, name))
    return found


def session_header(versions, root=MODS_ROOT):
    """The header lines: the client, Python and mod versions (`versions`: (name, version) pairs) and the packages."""
    try:
        packages = installed_packages(root)
    except (IOError, OSError):
        packages = []
    return [
        'session start',
        'client %s, python %s' % (client_version() or '?', sys.version.split()[0]),
        'mod %s' % ', '.join('%s %s' % pair for pair in versions),
        'packages: %s' % (', '.join(packages) or 'none found'),
    ]


def open_session_log(config_dir, versions):
    """Starts `<config_dir>/otmetki.log` for this session; False when it cannot be written."""
    return open_file(os.path.join(config_dir, FILE_NAME), session_header(versions))
