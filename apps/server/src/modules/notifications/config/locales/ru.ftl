missing = —
open = Открыть

moe-gained-title = Новая отметка!
moe-gained-body = { $nickname }: { $marks }-я отметка на { $tankName }
moe-gained-followed-title = Друг взял отметку
moe-gained-followed-body = { $nickname } получил { $marks }-ю отметку на { $tankName }

moe-threshold-dropped-title = Порог отметки снизился
moe-threshold-dropped-body = { $tankName }: { $mark }-я отметка теперь { NUMBER($to, maximumFractionDigits: 0) } урона (было { NUMBER($from, maximumFractionDigits: 0) })

session-finished-title = Итоги сессии
session-finished-body = { $nickname }: { $battles } { $battles ->
        [one] бой
        [few] боя
       *[many] боёв
    }, { NUMBER($winRate, minimumFractionDigits: 1, maximumFractionDigits: 1) }% побед, { NUMBER($avgDamage, maximumFractionDigits: 0) } среднего урона, WN8 { $wn8 ->
        [none] { missing }
       *[other] { NUMBER($wn8, maximumFractionDigits: 0) }
    }

bonus-code-title = Новый бонус-код
bonus-code-body = { $code }{ $description ->
        [none] {""}
       *[other] {" "}{ $description }
    }

premium-offer-title = Скидка на отслеживаемый танк
premium-offer-body = { $tankName }: скидка { $discount ->
        [none] { missing }
       *[other] { NUMBER($discount, maximumFractionDigits: 0) }%
    }

challenge-resolved-title = Челлендж завершён
challenge-resolved-body = «{ $title }»: { $outcome ->
        [succeeded] выполнен
       *[failed] провален
    }

clan-event-reminder-title = [{ $clanTag }] Скоро событие
clan-event-reminder-body = «{ $title }» начнётся { $startsAt ->
        [none] { missing }
       *[other] { $startsAt }
    }

clan-weekly-report-title = [{ $clanTag }] Недельный отчёт
clan-weekly-report-body = Событий: { $events }, явка { $attendance ->
        [none] { missing }
       *[other] { NUMBER($attendance, maximumFractionDigits: 0) }%
    }, новых кандидатов: { $newCandidates }, неактивных бойцов: { $inactiveMembers }

badge-awarded-title = Новый бейдж!
badge-awarded-body = «{ $title }» получен

digest-title = Ваша неделя в «Трёх отметках»
digest-body = { $battles } { $battles ->
        [one] бой
        [few] боя
       *[many] боёв
    } в { $sessions } { $sessions ->
        [one] сессии
       *[other] сессиях
    }, { NUMBER($winRate, minimumFractionDigits: 1, maximumFractionDigits: 1) }% побед, { NUMBER($avgDamage, maximumFractionDigits: 0) } среднего урона, новых отметок: { $marksGained }
digest-empty = На этой неделе боёв не было. Ждём вас в игре!
