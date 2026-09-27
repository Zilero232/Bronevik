-- One-off backfill of the latest snapshot per (account, tank, mode), kept outside the hypertable so
-- retention never drops a tank's last known totals. Runs only while the table is still empty.

INSERT INTO tank_snapshot_latest (
  account_id, tank_id, mode, captured_at, battles, wins, losses, draws, damage_dealt, damage_received, frags, spotted, xp,
  survived_battles, hits, shots, capture_points, dropped_capture_points, avg_damage_blocked, mark_of_mastery, marks_on_gun,
  max_frags, max_xp
)
SELECT DISTINCT ON (s.account_id, s.tank_id, s.mode)
  s.account_id, s.tank_id, s.mode, s.captured_at, s.battles, s.wins, s.losses, s.draws, s.damage_dealt, s.damage_received, s.frags,
  s.spotted, s.xp, s.survived_battles, s.hits, s.shots, s.capture_points, s.dropped_capture_points, s.avg_damage_blocked,
  s.mark_of_mastery, s.marks_on_gun, s.max_frags, s.max_xp
FROM tank_snapshot s
JOIN player p ON p.account_id = s.account_id
WHERE NOT EXISTS (SELECT 1 FROM tank_snapshot_latest)
ORDER BY s.account_id, s.tank_id, s.mode, s.captured_at DESC
ON CONFLICT DO NOTHING;
