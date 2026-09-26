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

digest-title = Your week on Three Marks
digest-body = { $battles } { $battles ->
        [one] battle
       *[other] battles
    } in { $sessions } { $sessions ->
        [one] session
       *[other] sessions
    }, { NUMBER($winRate, minimumFractionDigits: 1, maximumFractionDigits: 1) }% wins, { NUMBER($avgDamage, maximumFractionDigits: 0) } average damage, new marks: { $marksGained }
digest-empty = No battles this week. See you in the game!
