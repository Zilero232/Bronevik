from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld

from ...core.log import log, safe


@safe
def open_url(url):
    """The player's browser (BigWorld.wg_openWebBrowser, UNVERIFIED on Lesta 1.45), else the system one."""
    opener = getattr(BigWorld, 'wg_openWebBrowser', None)
    if opener is not None:
        opener(url)
        return True
    import webbrowser
    if webbrowser.open(url):
        return True
    log('ui: no browser for %s' % url)
    return False
