"""Feature: in-battle MoE panel. Depends on the core and the companion (hangar MoE snapshots)."""

FEATURE_ID = 'marks_panel'
PACKAGE_ID = 'net.triotmetki.marks_panel'
PACKAGE_NAME = 'Three Marks: MoE panel'
VERSION = '0.1.0'


def create(app):
    from .client import MarksPanel
    return MarksPanel(app)


def register():
    """Called by the feature's mod_* entry script; safe in any load order (see core.registry)."""
    from ...core.registry import registry
    return registry().register(FEATURE_ID, create)
