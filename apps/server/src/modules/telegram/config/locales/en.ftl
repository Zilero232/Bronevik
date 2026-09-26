cmd-me = My stats
cmd-session = Current session
cmd-marks = Marks of excellence
cmd-clan = My clan
cmd-tank = Tank: /tank name
cmd-top = Top players by WN8
cmd-settings = Notifications
cmd-login = Sign in on the site
cmd-help = Help

start-welcome =
    Hi! I am the Three Marks bot — Tanks stats right in Telegram.

    Link your account: open the site → Profile → Telegram and send me the code, or just sign in with the button below.
start-linked = Done! Telegram is linked to your Three Marks account. Commands: /me /session /marks /clan /tank /top /settings
start-code-invalid = The code is unknown, already used or expired. Get a new one on the site.
start-code-taken = This Telegram account is linked to another Three Marks account.
login-link = Your sign-in link (valid for { $minutes } min):
login-button = Sign in
open-site = Open on the site
open-app = Open Three Marks
help =
    /me [nickname] — player stats
    /session — current session
    /marks — marks and the closest to the next one
    /clan — your clan
    /tank name — tank mark thresholds
    /top — top players by WN8
    /settings — notifications
    /login — sign-in link for the site

    In any chat: @{ $bot } nickname — a player card.
not-linked = Link your Lesta account on the site first, or pass a nickname: /me nickname
player-not-found = Player not found.
player-card =
    { $nickname } { $clan }
    Battles: { $battles }
    Wins: { $winRate }
    Average damage: { $avgDamage }
    WN8: { $wn8 }
session-none = No sessions yet. Play a few battles — with the Three Marks mod the session shows up at once.
session-card =
    Session since { $startedAt } { $state }
    Battles: { $battles }, wins: { $winRate }
    Average damage: { $avgDamage }
    WN8: { $wn8 }
session-open = (live)
session-closed = (finished)
marks-none = No marks yet.
marks-card =
    Three marks: { $moe3 }
    Two marks: { $moe2 }
    One mark: { $moe1 }
marks-closest = Closest to the next mark:
marks-line = { $tank }: { $percent }% ({ $marks } marks)
clan-none = The player is not in a clan.
clan-card =
    [{ $tag }] { $name }
    Members: { $members }
    Role: { $role }
tank-usage = Pass a name: /tank Obj. 140
tank-not-found = Tank not found.
tank-card =
    { $name } — tier { $tier }, { $type }
    Marks: 1 — { $p65 }, 2 — { $p85 }, 3 — { $p95 }
tank-no-thresholds = No mark thresholds yet.
top-empty = The rating is still being computed.
top-header = Top by WN8:
top-line = { $place }. { $nickname } — { $wn8 } ({ $battles } battles)
settings-title = Notifications in Telegram and the browser. Tap to toggle.
settings-channel-telegram = Telegram
settings-channel-webPush = Browser push
settings-event-moeGained = New marks
settings-event-moeThresholdDropped = Threshold drops
settings-event-sessionFinished = Session summary
settings-event-bonusCode = Bonus codes
settings-event-premiumOffer = Tank discounts
settings-event-challengeResolved = Challenges
settings-weekly-digest = Weekly digest
settings-on = ✅ { $label }
settings-off = ▫️ { $label }
settings-not-linked = Settings need a linked account: /start
inline-not-found = Player not found
inline-card-description = WN8 { $wn8 } · { $winRate } wins · { $battles } battles
notification-open = Open
error-generic = Something went wrong. Please try again later.
missing = —
