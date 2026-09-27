"""Feature: hangar session panel and the session id on battle results. Depends on the core and the companion."""

FEATURE_ID = 'session_stats'
PACKAGE_ID = 'net.triotmetki.session_stats'
PACKAGE_NAME = 'Three Marks: session stats'
VERSION = '0.1.0'


def create(app):
    from .client import SessionStats
    return SessionStats(app)


def register():
    """Called by the feature's mod_* entry script; safe in any load order (see core.registry)."""
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
