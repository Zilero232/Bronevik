from __future__ import absolute_import, division, print_function, unicode_literals

from ....core.vendor import attr


# What the Session card shows: the aggregator's `summary` ({} without a session), the site `goals` already cut to
# `max_goals`, the account `overview` (None until read or with `show_account` off), the short names of the goals'
# tanks and the `moe` change of the tanks played (SessionMoe.rows, empty with `show_moe` off).
@attr.s(frozen=True)
class SessionView(object):

    summary = attr.ib()
    goals = attr.ib(default=())
    overview = attr.ib(default=None)
    vehicle_names = attr.ib(factory=dict)
    moe = attr.ib(default=())
