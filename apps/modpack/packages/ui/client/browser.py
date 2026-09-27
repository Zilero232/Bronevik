from __future__ import absolute_import, division, print_function, unicode_literals

import BigWorld

from ...core.log import log, safe


@safe
# BigWorld.wg_openWebBrowser is UNVERIFIED on Lesta 1.45; the system browser is the fallback.
def open_url(url):
    opener = getattr(BigWorld, 'wg_openWebBrowser', None)
    if opener is not None:
        opener(url)
        return True
    import webbrowser
    if webbrowser.open(url):
        return True
    log('ui: no browser for %s' % url)
    return False
