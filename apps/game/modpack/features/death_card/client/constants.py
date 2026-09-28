from __future__ import absolute_import, division, print_function, unicode_literals

# RU 1.45 client source (Avatar.py): the server tells the own client the direction of every hit on the own tank through
# PlayerAvatar.showOwnVehicleHitDirection(hitDirYaw, attackerID, damage, crits, isBlocked, isShellHE, damagedID,
# attackReasonID); the game's damage indicator draws it. UNVERIFIED on Lesta 1.45: that hitDirYaw is a world yaw (the
# card turns it into a hull side with the own vehicle's yaw).
AVATAR_MODULE = 'Avatar'
AVATAR_CLASS = 'PlayerAvatar'
HIT_DIRECTION_METHOD = 'showOwnVehicleHitDirection'
