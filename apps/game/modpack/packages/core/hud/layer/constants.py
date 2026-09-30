from __future__ import absolute_import, division, print_function, unicode_literals

# One rule for everything that covers the battle view: the panels keep their place and stay drawn, only their `visible`
# (hidden) or `dim` (faded where the covering view lies) prop changes, so nothing is recreated and no docked column
# closes up. Reasons: the stock GUI hidden with V, the post-mortem camera on the killer, the battle loading screen with
# the team lists, and the full stats held open with Tab.
COVER_GUI = 'gui'
COVER_KILLCAM = 'killcam'
COVER_LOADING = 'loading'
COVER_FULL_STATS = 'full_stats'
COVER_HIDE = 'hide'
COVER_DIM = 'dim'
COVER_EFFECTS = {
    COVER_GUI: COVER_HIDE,
    COVER_KILLCAM: COVER_HIDE,
    COVER_LOADING: COVER_HIDE,
    COVER_FULL_STATS: COVER_DIM,
}
