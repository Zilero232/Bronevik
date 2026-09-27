export const CATALOG_SQL = {
  gameVersion: 'SELECT version, detected_at FROM game_version WHERE is_current ORDER BY detected_at DESC LIMIT 1',
  vehicles: `
    SELECT tank_id, name, short_name, tag, nation, type::text AS type, tier, is_premium, is_collectible, is_gift, is_wheeled,
      price_credit, price_gold, description, prev_tank_ids, crew, modules_tree,
      (specs->'hull'->>'maxHealth')::float AS hull_hp,
      (specs->'turrets'->-1->>'maxHealth')::float AS turret_hp,
      specs->'turrets'->-1->'guns'->-1->'shots' AS shots,
      (specs->'turrets'->-1->'guns'->-1->>'maxAmmo')::int AS max_ammo
    FROM vehicle
    WHERE is_active
    ORDER BY tank_id`,
  expected: `
    SELECT DISTINCT ON (tank_id) tank_id, exp_damage, exp_frags, exp_spotted, exp_defense, exp_win_rate
    FROM wn8_expected_value
    ORDER BY tank_id, date DESC`,
  shellPrices: `
    SELECT DISTINCT ON ((data->>'shellId')::int) (data->>'shellId')::int AS shell_id,
      (data->'price'->>'amount')::int AS amount, data->'price'->>'currency' AS currency
    FROM game_data_entry
    WHERE kind = 'shell' AND data ? 'shellId'
    ORDER BY (data->>'shellId')::int, game_version_id DESC`,
  provisions:
    'SELECT provision_id, name, tag, type::text AS type, description, price_credit, price_gold, weight, tank_ids FROM provision ORDER BY provision_id',
  modules: 'SELECT module_id, name, type::text AS type, nation, tier, price_credit, weight, tank_ids FROM module ORDER BY module_id',
  arenas: 'SELECT arena_id, name, description, camouflage_type, modes FROM arena WHERE is_active ORDER BY arena_id',
  crewSkills: 'SELECT skill, name, type, roles, is_common, description FROM crew_skill ORDER BY skill',
  crewRoles: 'SELECT role, name, skills FROM crew_role ORDER BY role'
} as const;

export const CATALOG_DEFAULTS = {
  gameVersion: '1.0.0.0',
  maxAmmo: 40,
  hp: 1000,
  shellCurrency: 'credits'
} as const;
