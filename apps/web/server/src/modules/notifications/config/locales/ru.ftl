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

replay-overflow-title = { $daysLeft ->
    [1] Завтра удалим лишние реплеи
   *[other] Лишние реплеи удалим через { $daysLeft } дн.
}
replay-overflow-body = У вас { $stored } реплеев, бесплатно хранится { $keep }. { $deleteAt } оставим { $keep } самых новых, остальные удалим. Оформите Плюс, чтобы сохранить все.

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

first-win-available-title = Первая победа дня
first-win-available-body = { $nickname }: бонус за первую победу ещё доступен на { $available } { $available ->
        [one] танке
       *[other] танках
    }

watchlist-digest-title = Сводка по избранным игрокам
watchlist-digest-body = Играли { $players } { $players ->
        [one] игрок
        [few] игрока
       *[many] игроков
    }: { $battles } { $battles ->
        [one] бой
        [few] боя
       *[many] боёв
    }, новых отметок: { $marks }. { $leader ->
        [none] {""}
       *[other] Активнее всех — { $leader }: { $leaderBattles } { $leaderBattles ->
            [one] бой
            [few] боя
           *[many] боёв
        }, { NUMBER($leaderWinRate, maximumFractionDigits: 1) }% побед
    }

tank-returned-title = Танк вернулся в магазин
tank-returned-body = { $tankName } снова продаётся{ $absentDays ->
        [none] {""}
       *[other] {" "}после { $absentDays } дн. перерыва
    }{ $discount ->
        [none] {""}
       *[other] , скидка { NUMBER($discount, maximumFractionDigits: 0) }%
    }

competition-finished-title = Состязание завершено
competition-finished-body = «{ $title }»: команда «{ $teamName }» заняла { $rank }-е место из { $teams }

streamer-live-title = { $name } в эфире
streamer-live-body = Трансляция началась: { $platform }
streamer-live-tank-title = { $name } в эфире на { $tankName }
streamer-live-tank-body = Трансляция на { $tankName }: { $platform }

tank-level-up-title = { $tankName }: уровень { $level }
tank-level-up-body = Новый уровень танка — { $level }. Начислено { $shells } { $shells ->
        [one] гильза
        [few] гильзы
       *[many] гильз
    }

tank-challenge-done-title = Челлендж недели выполнен
tank-challenge-done-body = { $tankName }: задание недели выполнено. Начислено { $shells } { $shells ->
        [one] гильза
        [few] гильзы
       *[many] гильз
    }

plus-checkout-open-title = Подписка «Три отметки Плюс» открыта
plus-checkout-open-body = Вы просили сообщить: оформить Плюс уже можно.

lesta-relink-required-title = Перепривяжите аккаунт Лесты
lesta-relink-required-body = { $nickname }: доступ Леста ID истёк и не продлился. Перепривяжите аккаунт, чтобы вернуть ангар, плейлист и первую победу дня.
