# -*- coding: utf-8 -*-
from __future__ import absolute_import, division, print_function, unicode_literals

import math

from ....core.classes import class_key
from ....core.compat import is_number, to_text
from ....core.format import COLOR_DOWN, COLOR_MUTED, COLOR_NEUTRAL, COLOR_WARN, font, format_number
from ....core.shells import SHELL_CODES
from .constants import (FULL_TURN, MAX_MODULES, MODULE_STATES, MODULE_WINDOW_S, MODULES, SECTOR_ARROWS, SECTORS, SHOT_WINDOW_S, SOURCES)

# Fair play: only what the client already told the player about their own tank. The attacker is the one the damage
# panel and the kill feed name; the direction is the coarse side the game's own hit indicator pointed to for that
# hit, never a position. The card shows after the own tank is destroyed, nothing is drawn while it is alive, and
# no trajectory is reconstructed.


def sector_of(hit_yaw, hull_yaw):
    """The hull side (SECTORS) a hit came from, `hit_yaw` and `hull_yaw` in radians in the same frame; None if unknown."""
    if not is_number(hit_yaw) or not is_number(hull_yaw):
        return None
    relative = (hit_yaw - hull_yaw) % FULL_TURN
    index = int(math.floor((relative + FULL_TURN / 16) / (FULL_TURN / 8))) % 8
    return SECTORS[index]


class DeathWatch(object):
    """The last shot on the own tank, the modules it damaged and the side it came from, until the tank is destroyed."""

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
        self.modules = [module for module in self.modules if at - module[1] <= MODULE_WINDOW_S]

    def module(self, name, state, at):
        if name not in MODULES or state not in MODULE_STATES:
            return False
        self.modules = [module for module in self.modules if module[0] != name and at - module[1] <= MODULE_WINDOW_S]
        self.modules.append((name, at))
        return True

    def hit_direction(self, sector, at):
        if sector in SECTORS:
            self.direction = (sector, at)

    def killed(self, killer, killer_class, at):
        """The card of the own death; the killer the kill feed named wins over an older or missing shot."""
        shot = self.shot if self.shot is not None and at - self.shot['at'] <= SHOT_WINDOW_S else None
        card = dict(shot) if shot is not None else {'attacker': None, 'class': None, 'shell': None, 'damage': 0, 'source': None, 'at': at}
        if killer and (shot is None or not card['attacker']):
            card['attacker'] = to_text(killer)
            card['class'] = class_key(killer_class)
        card['modules'] = [name for name, when in self.modules if at - when <= max(MODULE_WINDOW_S, SHOT_WINDOW_S)][-MAX_MODULES:]
        direction = self.direction if self.direction is not None and at - self.direction[1] <= SHOT_WINDOW_S else None
        card['sector'] = direction[0] if direction is not None else None
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
    return font(translate('death_card_direction', arrow=arrow, side=translate('death_card_side_' + sector)), COLOR_MUTED, size)


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
