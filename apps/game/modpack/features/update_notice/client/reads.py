from __future__ import absolute_import, division, print_function, unicode_literals

import os

from ....core.log import log_exception
from ..model import game_folder, installed_packages
from .constants import MODS_ROOT


def installed(root=MODS_ROOT):
    """(the client version folder name, {package id: version}) of our packages the running client loads."""
    try:
        if not os.path.isdir(root):
            return None, {}
        folder = game_folder(os.listdir(root))
        if folder is None:
            return None, {}
        return folder, installed_packages(os.listdir(os.path.join(root, folder)))
    except Exception:
        log_exception('update notice: mods folder')
        return None, {}
