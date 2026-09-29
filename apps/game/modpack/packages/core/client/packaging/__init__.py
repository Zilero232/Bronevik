from __future__ import absolute_import, division, print_function, unicode_literals

import os

from ...log import log, safe
from ...packaging import mixed_install
from .constants import MODS_ROOT


@safe
def warn_mixed_install(root=MODS_ROOT):
    """Log every mods/<client version> folder that holds both our single package and the split ones."""
    if not os.path.isdir(root):
        return []
    found = []
    for folder in sorted(os.listdir(root)):
        path = os.path.join(root, folder)
        mixed = mixed_install(os.listdir(path)) if os.path.isdir(path) else None
        if mixed is None:
            continue
        single, split = mixed
        found.append(path)
        log('WARNING: %s holds both the single package (%s) and %d split packages (%s, ...): the client mounts two copies of '
            'every file and either may win. Keep one set: delete %s, or delete the split net.triotmetki.* / otmetki.companion_* '
            'files.' % (path, ', '.join(single), len(split), split[0], ', '.join(single)))
    return found
