"""Feature: opt-in replay auto-upload (`upload_replays`, `publish_replays`). Depends on the core and the companion."""

FEATURE_ID = 'replay_upload'
PACKAGE_ID = 'net.triotmetki.replay_upload'
PACKAGE_NAME = 'Three Marks: replay auto-upload'
VERSION = '0.1.0'


def create(app):
    from .client import ReplayAutoUpload
    return ReplayAutoUpload(app)


def register():
    """Called by the feature's mod_* entry script; safe in any load order (see core.registry)."""
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
