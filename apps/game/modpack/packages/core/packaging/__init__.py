"""Which of our package formats sit in a mods folder. The single package is the union of the split ones under
the companion's id: installed together, the client mounts two copies of every file and which one wins is not
defined, so the older set can shadow the newer one."""
from __future__ import absolute_import, division, print_function, unicode_literals

from ..compat import string_types
from .constants import SINGLE_PACKAGE, SPLIT_PACKAGE


def mixed_install(file_names):
    """(single package files, split package files) when both formats are present, else None."""
    names = sorted(name for name in file_names or () if isinstance(name, string_types))
    single = [name for name in names if SINGLE_PACKAGE.match(name)]
    split = [name for name in names if SPLIT_PACKAGE.match(name)]
    return (single, split) if single and split else None
