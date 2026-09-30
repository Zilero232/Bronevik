# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.classes import class_key
from ....core.compat import is_number, to_text
from ....core.format import COLOR_DOWN, COLOR_MUTED, COLOR_NEUTRAL, COLOR_WARN, font, format_number
from ....core.shells import SHELL_CODES
from .constants import (
    FULL_TURN,
    MAX_MODULES,
    MODULE_STATES,
    MODULE_WINDOW_S,
    MODULES,
    NO_SHOT,
    SECTOR_ARROWS,
    SECTORS,
    SHOT_WINDOW_S,
    SOURCES,
)

# Fair play: only what the client already told the player about their own tank. The attacker is the one the damage
# panel and the kill feed name; the direction is the coarse side the game's own hit indicator pointed to for that
# hit, never a position. The card shows after the own tank is destroyed, nothing is drawn while it is alive, and
# no trajectory is reconstructed.


# `hit_yaw` and `hull_yaw` are radians in the same frame; each sector is centred on its direction, so the turn is
# shifted by half a sector before it is cut into sectors.
def sector_of(hit_yaw, hull_yaw):
    if not is_number(hit_yaw) or not is_number(hull_yaw):
        return None
    sector_width = FULL_TURN / len(SECTORS)
    relative = (hit_yaw - hull_yaw) % FULL_TURN
    index = int(math.floor((relative + sector_width / 2) / sector_width)) % len(SECTORS)
    return SECTORS[index]


def _is_recent(at, when, window):
    return at - when <= window


class DeathWatch(object):

    def __init__(self):
        self.shot = None
        self.modules = []
        self.direction = None
        self.card = None

    def hit(self, attacker, vehicle_class, shell, damage, source, at):
        self.shot = {
            'attacker': to_text(attacker) if attacker else None,
            'class': class_key(vehicle_class),
            'shell': shell if shell in SHELL_CODES else None,
            'damage': int(damage) if is_number(damage) and damage > 0 else 0,
            'source': source if source in SOURCES else 'shot',
            'at': at,
        }
        self.modules = [module for module in self.modules if _is_recent(at, module[1], MODULE_WINDOW_S)]

    def module(self, name, state, at):
        if name not in MODULES or state not in MODULE_STATES:
            return False
        kept = [module for module in self.modules if module[0] != name]
        self.modules = [module for module in kept if _is_recent(at, module[1], MODULE_WINDOW_S)]
        self.modules.append((name, at))
        return True

    def hit_direction(self, sector, at):
        if sector in SECTORS:
            self.direction = (sector, at)

    def _killing_shot(self, at):
        if self.shot is None or not _is_recent(at, self.shot['at'], SHOT_WINDOW_S):
            return None
        return self.shot

    def _killing_modules(self, at):
        window = max(MODULE_WINDOW_S, SHOT_WINDOW_S)
        names = [name for name, when in self.modules if _is_recent(at, when, window)]
        return names[-MAX_MODULES:]

    def _killing_sector(self, at):
        if self.direction is None:
            return None
        sector, when = self.direction
        return sector if _is_recent(at, when, SHOT_WINDOW_S) else None

    # The killer the kill feed named wins over an older or missing shot.
    def killed(self, killer, killer_class, at):
        shot = self._killing_shot(at)
        card = dict(shot) if shot is not None else dict(NO_SHOT, at=at)
        if killer and not card['attacker']:
            card['attacker'] = to_text(killer)
            card['class'] = class_key(killer_class)

        card['modules'] = self._killing_modules(at)
        card['sector'] = self._killing_sector(at)
        self.card = card
        return card


def title_line(card, translate, size):
    who = card.get('attacker') or translate('death_card_unknown')
    if card.get('class'):
        who = u'%s %s' % (translate('death_card_class_' + card['class']), who)
    return font(translate('death_card_title', attacker=who), COLOR_DOWN, size + 2)


def shot_line(card, translate, size):
    parts = []
    source = card.get('source')
    if source and source != 'shot':
        parts.append(translate('death_card_source_' + source))
    elif card.get('shell'):
        parts.append(translate('death_card_shell_' + card['shell']))
    if card.get('damage'):
        parts.append(translate('death_card_damage', damage=format_number(card['damage'])))
    return font(u' · '.join(parts), COLOR_NEUTRAL, size) if parts else None


def modules_line(card, translate, size):
    if not card.get('modules'):
        return None
    names = u', '.join(translate('death_card_module_' + name) for name in card['modules'])
    return font(translate('death_card_modules', modules=names), COLOR_WARN, size)


def direction_line(card, translate, size):
    sector = card.get('sector')
    if sector not in SECTORS:
        return None
    arrow = SECTOR_ARROWS[SECTORS.index(sector)]
    side = translate('death_card_side_' + sector)
    return font(translate('death_card_direction', arrow=arrow, side=side), COLOR_MUTED, size)


def format_card(card, settings, translate):
    if card is None:
        return None
    size = settings.get('font_size')
    lines = [title_line(card, translate, size), shot_line(card, translate, size)]

    if settings.get('show_modules'):
        lines.append(modules_line(card, translate, size))
    if settings.get('show_direction'):
        lines.append(direction_line(card, translate, size))
    return u'\n'.join(line for line in lines if line)
