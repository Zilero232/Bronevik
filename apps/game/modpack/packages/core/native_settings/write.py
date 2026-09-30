from __future__ import absolute_import, division, print_function, unicode_literals


# Writes `values` through a settings core in the order the game's own settings window uses (RU 1.45 client source,
# gui/Scaleform/daapi/view/common/settings/SettingsParams.apply): applySettings(diff) returns nothing;
# applyStorages(restartApproved) returns the confirmators that confirmChanges walks; clearStorages() drops the staged
# values once they are stored.
def write_settings(core, values):
    core.applySettings(dict(values))
    confirmators = core.applyStorages(False) or []
    core.confirmChanges(confirmators)
    core.clearStorages()
