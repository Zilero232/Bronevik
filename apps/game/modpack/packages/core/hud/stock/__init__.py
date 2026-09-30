"""Which stock battle HUD elements our panels replace (docs/specs/2026-09-29-hud-visual-redesign.md section 3.2).

`StockSuppression` keeps `{alias: owners}`: a component asks for the stock aliases it replaces with `want(owner, aliases)`
while its Gameface widget is drawn and passes `()` when it stops (switched off, GUIFlash, battle left). `filter(visible,
hidden)` is what the wrapped `SharedPage._setComponentsVisibility` passes on: a suppressed alias never becomes visible
again, however often the page re-shows its components (control mode, Tab, postmortem). The client side is
`core/client/hud/stock`.

Fair play: a stock element is hidden only while our replacement shows the same or strictly own information.
"""
from __future__ import absolute_import, division, print_function, unicode_literals

from .constants import BATTLE_DAMAGE_LOG_PANEL, BATTLE_TIMER, FRAG_CORRELATION_BAR, SIXTH_SENSE, STOCK_ALIASES

__all__ = ('BATTLE_DAMAGE_LOG_PANEL', 'BATTLE_TIMER', 'FRAG_CORRELATION_BAR', 'SIXTH_SENSE', 'STOCK_ALIASES', 'StockSuppression')


class StockSuppression(object):

    def __init__(self):
        self.owners = {}

    @property
    def aliases(self):
        return frozenset(alias for alias, owners in self.owners.items() if owners)

    def want(self, owner, aliases):
        """Set what `owner` replaces; returns (newly hidden, released) aliases."""
        wanted = frozenset(alias for alias in (aliases or ()) if alias in STOCK_ALIASES)
        before = self.aliases
        for alias in list(self.owners):
            self.owners[alias].discard(owner)
            if not self.owners[alias]:
                del self.owners[alias]
        for alias in wanted:
            self.owners.setdefault(alias, set()).add(owner)
        after = self.aliases
        return after - before, before - after

    def release_all(self):
        released = self.aliases
        self.owners = {}
        return released

    def filter(self, visible, hidden, aliases=None):
        """The (visible, hidden) sets the page should apply (`aliases`: the suppressed ones in force, all by default)."""
        suppressed = self.aliases if aliases is None else frozenset(aliases)
        visible = set(visible or ())
        hidden = set(hidden or ())
        blocked = visible & suppressed
        return visible - blocked, hidden | blocked
