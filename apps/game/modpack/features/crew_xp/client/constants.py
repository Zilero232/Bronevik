from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source: the crew member tooltip is a wulf view, gui/impl/lobby/crew/tooltips/tankman_tooltip.py
# TankmanTooltip._fillModel(); its model has no free text but a list of TankmanTooltipCommanderFeature
# (setDescription(text)) it fills for commanders. UNVERIFIED on Lesta 1.45: whether the page shows the list for
# other roles too; without it the line is simply not drawn.
TOOLTIP_MODULE = 'gui.impl.lobby.crew.tooltips.tankman_tooltip'
TOOLTIP_CLASS = 'TankmanTooltip'
TOOLTIP_METHOD = '_fillModel'
FEATURE_MODULE = 'gui.impl.gen.view_models.views.lobby.crew.tooltips.tankman_tooltip_commander_feature'
FEATURE_CLASS = 'TankmanTooltipCommanderFeature'
