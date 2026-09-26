missing = —
open = Open

moe-gained-title = New mark of excellence!
moe-gained-body = { $nickname }: mark { $marks } on { $tankName }
moe-gained-followed-title = A friend earned a mark
moe-gained-followed-body = { $nickname } earned mark { $marks } on { $tankName }

moe-threshold-dropped-title = Mark threshold dropped
moe-threshold-dropped-body = { $tankName }: mark { $mark } now needs { NUMBER($to, maximumFractionDigits: 0) } damage (was { NUMBER($from, maximumFractionDigits: 0) })

session-finished-title = Session summary
session-finished-body = { $nickname }: { $battles } { $battles ->
        [one] battle
       *[other] battles
    }, { NUMBER($winRate, minimumFractionDigits: 1, maximumFractionDigits: 1) }% wins, { NUMBER($avgDamage, maximumFractionDigits: 0) } average damage, WN8 { $wn8 ->
        [none] { missing }
       *[other] { NUMBER($wn8, maximumFractionDigits: 0) }
    }

bonus-code-title = New bonus code
bonus-code-body = { $code }{ $description ->
        [none] {""}
       *[other] {" "}{ $description }
    }

premium-offer-title = A tracked tank is on sale
premium-offer-body = { $tankName }: { $discount ->
        [none] { missing }
       *[other] { NUMBER($discount, maximumFractionDigits: 0) }%
    } off

challenge-resolved-title = Challenge finished
challenge-resolved-body = "{ $title }": { $outcome ->
        [succeeded] completed
       *[failed] failed
    }

clan-event-reminder-title = [{ $clanTag }] Event soon
clan-event-reminder-body = "{ $title }" starts { $startsAt ->
        [none] { missing }
       *[other] { $startsAt }
    }

clan-weekly-report-title = [{ $clanTag }] Weekly report
clan-weekly-report-body = Events: { $events }, attendance { $attendance ->
        [none] { missing }
       *[other] { NUMBER($attendance, maximumFractionDigits: 0) }%
    }, new candidates: { $newCandidates }, inactive members: { $inactiveMembers }

badge-awarded-title = New badge!
badge-awarded-body = "{ $title }" earned

replay-overflow-title = { $daysLeft ->
    [1] Extra replays will be deleted tomorrow
   *[other] Extra replays will be deleted in { $daysLeft } days
}
replay-overflow-body = You have { $stored } replays and the free plan keeps { $keep }. On { $deleteAt } we keep the { $keep } newest and delete the rest. Get Plus to keep them all.

digest-title = Your week on Three Marks
digest-body = { $battles } { $battles ->
        [one] battle
       *[other] battles
    } in { $sessions } { $sessions ->
        [one] session
       *[other] sessions
    }, { NUMBER($winRate, minimumFractionDigits: 1, maximumFractionDigits: 1) }% wins, { NUMBER($avgDamage, maximumFractionDigits: 0) } average damage, new marks: { $marksGained }
digest-empty = No battles this week. See you in the game!

first-win-available-title = First win of the day
first-win-available-body = { $nickname }: the first-win bonus is still available on { $available } { $available ->
        [one] tank
       *[other] tanks
    }

watchlist-digest-title = Your watchlist digest
watchlist-digest-body = { $players } { $players ->
        [one] player
       *[other] players
    } played { $battles } { $battles ->
        [one] battle
       *[other] battles
    }, new marks: { $marks }. { $leader ->
        [none] {""}
       *[other] Most active: { $leader } with { $leaderBattles } { $leaderBattles ->
            [one] battle
           *[other] battles
        } at { NUMBER($leaderWinRate, maximumFractionDigits: 1) }% wins
    }

tank-returned-title = Tank is back in the shop
tank-returned-body = { $tankName } is on sale again{ $absentDays ->
        [none] {""}
       *[other] {" "}after { $absentDays } days away
    }{ $discount ->
        [none] {""}
       *[other] , { NUMBER($discount, maximumFractionDigits: 0) }% off
    }

competition-finished-title = Competition finished
competition-finished-body = “{ $title }”: team “{ $teamName }” placed { $rank } of { $teams }

streamer-live-title = { $name } is live
streamer-live-body = The stream has started: { $platform }
streamer-live-tank-title = { $name } is live on { $tankName }
streamer-live-tank-body = Streaming { $tankName }: { $platform }

tank-level-up-title = { $tankName }: level { $level }
tank-level-up-body = Your tank reached level { $level }. { $shells } { $shells ->
        [one] shell
       *[other] shells
    } credited

tank-challenge-done-title = Weekly challenge complete
tank-challenge-done-body = { $tankName }: this week's challenge is done. { $shells } { $shells ->
        [one] shell
       *[other] shells
    } credited
