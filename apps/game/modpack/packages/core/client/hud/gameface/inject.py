from __future__ import absolute_import, division, print_function, unicode_literals


def mod_inject(model, name, scripts=(), styles=()):
    """Load `scripts` and `styles` (coui:// URLs) into the client's own Gameface view of `model` through OpenWG
    Gameface's gf_mod_inject; the stock model must reserve one more property for it. Raises ImportError without
    OpenWG Gameface."""
    from openwg_gameface import gf_mod_inject
    gf_mod_inject(model, name, styles=list(styles), scripts=list(scripts))


def can_inject():
    """Whether OpenWG Gameface, which carries gf_mod_inject, is installed."""
    try:
        import openwg_gameface  # noqa: F401
    except ImportError:
        return False
    return True
