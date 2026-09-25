-- Trigram indexes on player, clan and vehicle names need pg_trgm before any table exists.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateEnum
CREATE TYPE "report_status" AS ENUM ('open', 'resolved', 'dismissed');

-- CreateEnum
CREATE TYPE "deletion_source" AS ENUM ('user', 'lesta', 'retention');

-- CreateEnum
CREATE TYPE "deletion_status" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "incident_status" AS ENUM ('investigating', 'identified', 'monitoring', 'resolved');

-- CreateEnum
CREATE TYPE "rating_period" AS ENUM ('overall', '24h', '7d', '30d', '60d', '1000b');

-- CreateEnum
CREATE TYPE "server_stats_period" AS ENUM ('1d', '7d', '14d', '30d', '60d');

-- CreateEnum
CREATE TYPE "cohort_filter" AS ENUM ('all', 'beginner', 'average', 'good', 'elite');

-- CreateEnum
CREATE TYPE "percentile_distribution" AS ENUM ('damage', 'xp');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('user', 'moderator', 'admin');

-- CreateEnum
CREATE TYPE "subscription_product" AS ENUM ('plus', 'clan_panel', 'developer_pro', 'overlays_pro');

-- CreateEnum
CREATE TYPE "subscription_plan" AS ENUM ('monthly', 'half_yearly', 'yearly');

-- CreateEnum
CREATE TYPE "subscription_status" AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'expired');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('pending', 'waiting_for_capture', 'succeeded', 'canceled', 'refunded');

-- CreateEnum
CREATE TYPE "payment_kind" AS ENUM ('subscription', 'donation', 'coaching');

-- CreateEnum
CREATE TYPE "clan_role" AS ENUM ('commander', 'executive_officer', 'personnel_officer', 'combat_officer', 'intelligence_officer', 'quartermaster', 'recruitment_officer', 'junior_officer', 'private', 'recruit', 'reservist');

-- CreateEnum
CREATE TYPE "clan_member_event_type" AS ENUM ('joined', 'left', 'kicked', 'role_changed');

-- CreateEnum
CREATE TYPE "clan_event_kind" AS ENUM ('clan_wars', 'stronghold', 'training', 'tournament', 'other');

-- CreateEnum
CREATE TYPE "attendance_status" AS ENUM ('invited', 'confirmed', 'declined', 'attended', 'absent');

-- CreateEnum
CREATE TYPE "recruit_status" AS ENUM ('sourced', 'contacted', 'trial', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "clan_integration_kind" AS ENUM ('discord', 'telegram');

-- CreateEnum
CREATE TYPE "guide_kind" AS ENUM ('tank', 'map', 'general');

-- CreateEnum
CREATE TYPE "comment_target" AS ENUM ('build', 'guide', 'replay', 'tactic_board');

-- CreateEnum
CREATE TYPE "post_status" AS ENUM ('open', 'closed', 'expired', 'hidden');

-- CreateEnum
CREATE TYPE "coaching_order_status" AS ENUM ('requested', 'accepted', 'paid', 'completed', 'cancelled', 'disputed');

-- CreateEnum
CREATE TYPE "tournament_status" AS ENUM ('draft', 'registration', 'running', 'finished', 'cancelled');

-- CreateEnum
CREATE TYPE "api_plan" AS ENUM ('free', 'pro', 'partner');

-- CreateEnum
CREATE TYPE "webhook_event" AS ENUM ('moe_gained', 'session_finished', 'clan_roster_changed', 'moe_threshold_dropped');

-- CreateEnum
CREATE TYPE "delivery_status" AS ENUM ('pending', 'succeeded', 'failed');

-- CreateEnum
CREATE TYPE "moderation_status" AS ENUM ('draft', 'pending', 'published', 'rejected', 'hidden');

-- CreateEnum
CREATE TYPE "vehicle_type" AS ENUM ('lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG');

-- CreateEnum
CREATE TYPE "module_type" AS ENUM ('vehicleChassis', 'vehicleTurret', 'vehicleGun', 'vehicleEngine', 'vehicleRadio');

-- CreateEnum
CREATE TYPE "provision_type" AS ENUM ('equipment', 'optional_device', 'directive', 'field_modification');

-- CreateEnum
CREATE TYPE "threshold_source" AS ENUM ('bronevik', 'poliroid', 'kttc', 'lesta', 'manual');

-- CreateEnum
CREATE TYPE "tracking_tier" AS ENUM ('active', 'population', 'dormant');

-- CreateEnum
CREATE TYPE "replay_status" AS ENUM ('uploaded', 'parsing', 'parsed', 'failed');

-- CreateEnum
CREATE TYPE "visibility" AS ENUM ('public', 'unlisted', 'private');

-- CreateEnum
CREATE TYPE "session_source" AS ENUM ('api', 'mod');

-- CreateEnum
CREATE TYPE "session_kind" AS ENUM ('day', 'live');

-- CreateEnum
CREATE TYPE "session_status" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "battle_result" AS ENUM ('win', 'loss', 'draw');

-- CreateEnum
CREATE TYPE "bonus_code_status" AS ENUM ('unknown', 'working', 'expired');

-- CreateEnum
CREATE TYPE "bonus_code_verdict" AS ENUM ('working', 'expired', 'already_used');

-- CreateEnum
CREATE TYPE "game_event_kind" AS ENUM ('event', 'sale', 'marathon', 'battle_pass', 'front_line', 'onslaught', 'ranked', 'personal_missions', 'drops', 'other');

-- CreateEnum
CREATE TYPE "news_kind" AS ENUM ('news', 'patch_notes', 'dev_blog');

-- CreateEnum
CREATE TYPE "stats_mode" AS ENUM ('all', 'random', 'clan', 'company', 'team', 'regular_team', 'stronghold_skirmish', 'stronghold_defense', 'globalmap', 'epic', 'ranked', 'fallout');

-- CreateEnum
CREATE TYPE "skill_cohort" AS ENUM ('beginner', 'average', 'good', 'elite');

-- CreateEnum
CREATE TYPE "target_kind" AS ENUM ('player', 'clan', 'tank');

-- CreateEnum
CREATE TYPE "notification_event" AS ENUM ('moe_gained', 'moe_threshold_dropped', 'mastery_gained', 'session_finished', 'clan_roster_changed', 'clan_event_reminder', 'bonus_code', 'premium_offer', 'tank_changed', 'goal_reached', 'badge_awarded', 'challenge_resolved');

-- CreateEnum
CREATE TYPE "notification_channel" AS ENUM ('telegram', 'email', 'web_push', 'site');

-- CreateEnum
CREATE TYPE "goal_metric" AS ENUM ('win_rate', 'wn8', 'avg_damage', 'battles', 'moe', 'brone_index');

-- CreateEnum
CREATE TYPE "goal_status" AS ENUM ('active', 'achieved', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "overlay_kind" AS ENUM ('session', 'wn8', 'moe', 'damage', 'win_rate', 'win_streak', 'challenge', 'custom');

-- CreateEnum
CREATE TYPE "challenge_status" AS ENUM ('pending', 'active', 'succeeded', 'failed', 'cancelled', 'expired', 'refunded');

-- CreateEnum
CREATE TYPE "streamer_provider" AS ENUM ('donation_alerts', 'twitch', 'vk_play_live', 'youtube');

-- CreateTable
CREATE TABLE "feature_flag" (
    "key" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "rollout_percent" SMALLINT NOT NULL DEFAULT 0,
    "variants" JSONB,
    "rules" JSONB,
    "updated_by_user_id" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_flag_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "actor_user_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_report" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "reporter_user_id" TEXT,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "status" "report_status" NOT NULL DEFAULT 'open',
    "resolved_by" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(3),

    CONSTRAINT "content_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_deletion_request" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "account_id" BIGINT NOT NULL,
    "requested_by_user_id" TEXT,
    "source" "deletion_source" NOT NULL,
    "status" "deletion_status" NOT NULL DEFAULT 'pending',
    "reason" TEXT,
    "error" TEXT,
    "requested_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(3),

    CONSTRAINT "data_deletion_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collector_job_metric" (
    "queue" TEXT NOT NULL,
    "bucket_start" TIMESTAMPTZ(3) NOT NULL,
    "processed" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "retried" INTEGER NOT NULL DEFAULT 0,
    "duration_ms_total" BIGINT NOT NULL DEFAULT 0,
    "lesta_requests" INTEGER NOT NULL DEFAULT 0,
    "lesta_errors" INTEGER NOT NULL DEFAULT 0,
    "lag_seconds" INTEGER,
    "queue_depth" INTEGER,

    CONSTRAINT "collector_job_metric_pkey" PRIMARY KEY ("queue","bucket_start")
);

-- CreateTable
CREATE TABLE "collector_state" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collector_state_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "service_incident" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "body" TEXT,
    "component" TEXT NOT NULL,
    "status" "incident_status" NOT NULL DEFAULT 'investigating',
    "started_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(3),

    CONSTRAINT "service_incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tank_server_stats" (
    "tank_id" INTEGER NOT NULL,
    "mode" "stats_mode" NOT NULL,
    "period" "server_stats_period" NOT NULL,
    "cohort" "cohort_filter" NOT NULL,
    "battles" INTEGER NOT NULL,
    "players" INTEGER NOT NULL,
    "win_rate" DOUBLE PRECISION NOT NULL,
    "player_win_rate" DOUBLE PRECISION NOT NULL,
    "win_rate_diff" DOUBLE PRECISION NOT NULL,
    "avg_damage" DOUBLE PRECISION NOT NULL,
    "avg_frags" DOUBLE PRECISION NOT NULL,
    "avg_spotted" DOUBLE PRECISION NOT NULL,
    "avg_xp" DOUBLE PRECISION NOT NULL,
    "avg_blocked" DOUBLE PRECISION NOT NULL,
    "survival_rate" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "popularity_rank" INTEGER,
    "tier_list_rank" TEXT,
    "computed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tank_server_stats_pkey" PRIMARY KEY ("tank_id","mode","period","cohort")
);

-- CreateTable
CREATE TABLE "account_rating" (
    "account_id" BIGINT NOT NULL,
    "period" "rating_period" NOT NULL,
    "battles" INTEGER NOT NULL,
    "win_rate" DOUBLE PRECISION NOT NULL,
    "avg_damage" DOUBLE PRECISION NOT NULL,
    "avg_frags" DOUBLE PRECISION NOT NULL,
    "avg_tier" DOUBLE PRECISION,
    "wn8" DOUBLE PRECISION,
    "eff" DOUBLE PRECISION,
    "brone_index" DOUBLE PRECISION,
    "from_captured_at" TIMESTAMPTZ(3),
    "to_captured_at" TIMESTAMPTZ(3),
    "computed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_rating_pkey" PRIMARY KEY ("account_id","period")
);

-- CreateTable
CREATE TABLE "account_tank_rating" (
    "account_id" BIGINT NOT NULL,
    "tank_id" INTEGER NOT NULL,
    "period" "rating_period" NOT NULL,
    "battles" INTEGER NOT NULL,
    "win_rate" DOUBLE PRECISION NOT NULL,
    "avg_damage" DOUBLE PRECISION NOT NULL,
    "avg_frags" DOUBLE PRECISION NOT NULL,
    "avg_xp" DOUBLE PRECISION NOT NULL,
    "wn8" DOUBLE PRECISION,
    "damage_percentile" DOUBLE PRECISION,
    "computed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_tank_rating_pkey" PRIMARY KEY ("account_id","tank_id","period")
);

-- CreateTable
CREATE TABLE "wn8_expected_value" (
    "tank_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "source" TEXT NOT NULL,
    "exp_damage" DOUBLE PRECISION NOT NULL,
    "exp_frags" DOUBLE PRECISION NOT NULL,
    "exp_spotted" DOUBLE PRECISION NOT NULL,
    "exp_defense" DOUBLE PRECISION NOT NULL,
    "exp_win_rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "wn8_expected_value_pkey" PRIMARY KEY ("tank_id","source","date")
);

-- CreateTable
CREATE TABLE "tank_percentile" (
    "tank_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "distribution" "percentile_distribution" NOT NULL,
    "percentiles" JSONB NOT NULL,

    CONSTRAINT "tank_percentile_pkey" PRIMARY KEY ("tank_id","distribution","date")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'user',
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "ban_reason" TEXT,
    "ban_expires" TIMESTAMPTZ(3),
    "locale" TEXT NOT NULL DEFAULT 'ru',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Moscow',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "impersonated_by" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMPTZ(3),
    "refresh_token_expires_at" TIMESTAMPTZ(3),
    "scope" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_lesta_account" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "account_id" BIGINT NOT NULL,
    "access_token" TEXT,
    "token_expires_at" TIMESTAMPTZ(3),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "linked_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_lesta_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "product" "subscription_product" NOT NULL,
    "plan" "subscription_plan" NOT NULL DEFAULT 'monthly',
    "status" "subscription_status" NOT NULL DEFAULT 'active',
    "clan_id" BIGINT,
    "current_period_end" TIMESTAMPTZ(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "trial_started_at" TIMESTAMPTZ(3),
    "saved_card_id" TEXT,
    "saved_card_title" TEXT,
    "pending_card_id" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "subscription_id" TEXT,
    "yookassa_payment_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RUB',
    "status" "payment_status" NOT NULL DEFAULT 'pending',
    "kind" "payment_kind" NOT NULL DEFAULT 'subscription',
    "product" "subscription_product",
    "plan" "subscription_plan",
    "is_auto_charge" BOOLEAN NOT NULL DEFAULT false,
    "promo_code" TEXT,
    "metadata" JSONB,
    "paid_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo_code" (
    "code" TEXT NOT NULL,
    "product" "subscription_product",
    "discount_percent" SMALLINT,
    "free_days" SMALLINT,
    "max_uses" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_code_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "promo_redemption" (
    "code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "redeemed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promo_redemption_pkey" PRIMARY KEY ("code","user_id")
);

-- CreateTable
CREATE TABLE "referral" (
    "referred_user_id" TEXT NOT NULL,
    "referrer_user_id" TEXT NOT NULL,
    "rewarded_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referral_pkey" PRIMARY KEY ("referred_user_id")
);

-- CreateTable
CREATE TABLE "clan" (
    "clan_id" BIGINT NOT NULL,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "motto" TEXT,
    "description" TEXT,
    "emblems" JSONB,
    "leader_id" BIGINT,
    "members_count" INTEGER NOT NULL DEFAULT 0,
    "is_disbanded" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3),
    "last_polled_at" TIMESTAMPTZ(3),
    "first_seen_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clan_pkey" PRIMARY KEY ("clan_id")
);

-- CreateTable
CREATE TABLE "clan_member" (
    "account_id" BIGINT NOT NULL,
    "clan_id" BIGINT NOT NULL,
    "role" "clan_role" NOT NULL,
    "joined_at" TIMESTAMPTZ(3),
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clan_member_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "clan_member_event" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clan_id" BIGINT NOT NULL,
    "account_id" BIGINT NOT NULL,
    "type" "clan_member_event_type" NOT NULL,
    "old_role" "clan_role",
    "new_role" "clan_role",
    "occurred_at" TIMESTAMPTZ(3) NOT NULL,
    "recorded_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clan_member_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clan_snapshot" (
    "clan_id" BIGINT NOT NULL,
    "captured_at" TIMESTAMPTZ(3) NOT NULL,
    "members_count" INTEGER NOT NULL,
    "active_members_7d" INTEGER,
    "avg_win_rate" DOUBLE PRECISION,
    "avg_wn8" DOUBLE PRECISION,
    "avg_battles" DOUBLE PRECISION,
    "battles_delta" INTEGER,
    "elo_rating_6" INTEGER,
    "elo_rating_8" INTEGER,
    "elo_rating_10" INTEGER,
    "ratings" JSONB,

    CONSTRAINT "clan_snapshot_pkey" PRIMARY KEY ("clan_id","captured_at")
);

-- CreateTable
CREATE TABLE "clan_stronghold" (
    "clan_id" BIGINT NOT NULL,
    "level" SMALLINT,
    "buildings" JSONB,
    "reserves" JSONB,
    "stats" JSONB,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clan_stronghold_pkey" PRIMARY KEY ("clan_id")
);

-- CreateTable
CREATE TABLE "globalmap_province" (
    "province_id" TEXT NOT NULL,
    "front_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "arena_id" TEXT,
    "owner_clan_id" BIGINT,
    "prime_time" TEXT,
    "daily_revenue" INTEGER,
    "data" JSONB,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "globalmap_province_pkey" PRIMARY KEY ("province_id")
);

-- CreateTable
CREATE TABLE "clan_workspace" (
    "clan_id" BIGINT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "settings" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clan_workspace_pkey" PRIMARY KEY ("clan_id")
);

-- CreateTable
CREATE TABLE "clan_event" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clan_id" BIGINT NOT NULL,
    "kind" "clan_event_kind" NOT NULL,
    "title" TEXT NOT NULL,
    "starts_at" TIMESTAMPTZ(3) NOT NULL,
    "ends_at" TIMESTAMPTZ(3),
    "remind_at" TIMESTAMPTZ(3),
    "data" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clan_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clan_attendance" (
    "event_id" TEXT NOT NULL,
    "account_id" BIGINT NOT NULL,
    "status" "attendance_status" NOT NULL DEFAULT 'invited',
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clan_attendance_pkey" PRIMARY KEY ("event_id","account_id")
);

-- CreateTable
CREATE TABLE "recruit_candidate" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clan_id" BIGINT NOT NULL,
    "account_id" BIGINT NOT NULL,
    "status" "recruit_status" NOT NULL DEFAULT 'sourced',
    "notes" TEXT,
    "created_by_user_id" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recruit_candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clan_integration" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clan_id" BIGINT NOT NULL,
    "kind" "clan_integration_kind" NOT NULL,
    "external_id" TEXT NOT NULL,
    "config" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clan_integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "build" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "author_user_id" TEXT NOT NULL,
    "tank_id" INTEGER NOT NULL,
    "game_version_id" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "loadout" JSONB NOT NULL,
    "stats" JSONB,
    "visibility" "visibility" NOT NULL DEFAULT 'public',
    "status" "moderation_status" NOT NULL DEFAULT 'published',
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "build_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "build_like" (
    "build_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "build_like_pkey" PRIMARY KEY ("build_id","user_id")
);

-- CreateTable
CREATE TABLE "guide" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "author_user_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" "guide_kind" NOT NULL,
    "tank_id" INTEGER,
    "arena_id" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'ru',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "moderation_status" NOT NULL DEFAULT 'draft',
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_like" (
    "guide_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guide_like_pkey" PRIMARY KEY ("guide_id","user_id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "author_user_id" TEXT NOT NULL,
    "target" "comment_target" NOT NULL,
    "target_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "body" TEXT NOT NULL,
    "status" "moderation_status" NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platoon_post" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "account_id" BIGINT NOT NULL,
    "tiers" INTEGER[],
    "modes" TEXT[],
    "tank_ids" INTEGER[],
    "has_voice" BOOLEAN NOT NULL DEFAULT false,
    "min_wn8" INTEGER,
    "message" TEXT,
    "status" "post_status" NOT NULL DEFAULT 'open',
    "available_from" TIMESTAMPTZ(3),
    "available_until" TIMESTAMPTZ(3),
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platoon_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recruiting_post" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "clan_id" BIGINT NOT NULL,
    "author_user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "requirements" JSONB,
    "status" "post_status" NOT NULL DEFAULT 'open',
    "expires_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recruiting_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tactic_board" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "owner_user_id" TEXT NOT NULL,
    "arena_id" TEXT,
    "mode" TEXT,
    "title" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "document" BYTEA,
    "share_token" TEXT NOT NULL DEFAULT replace((gen_random_uuid())::text, '-'::text, ''::text),
    "visibility" "visibility" NOT NULL DEFAULT 'unlisted',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tactic_board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coach_profile" (
    "user_id" TEXT NOT NULL,
    "account_id" BIGINT NOT NULL,
    "headline" TEXT NOT NULL,
    "bio" TEXT,
    "price_rub" DECIMAL(10,2) NOT NULL,
    "tank_ids" INTEGER[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION,
    "orders_done" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coach_profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "coaching_order" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "coach_user_id" TEXT NOT NULL,
    "student_user_id" TEXT NOT NULL,
    "replay_id" TEXT,
    "payment_id" TEXT,
    "status" "coaching_order_status" NOT NULL DEFAULT 'requested',
    "price_rub" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "review" TEXT,
    "score" SMALLINT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(3),

    CONSTRAINT "coaching_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "organizer_user_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "rules" JSONB,
    "requirements" JSONB,
    "bracket" JSONB,
    "status" "tournament_status" NOT NULL DEFAULT 'draft',
    "registration_ends_at" TIMESTAMPTZ(3),
    "starts_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_participant" (
    "tournament_id" TEXT NOT NULL,
    "account_id" BIGINT NOT NULL,
    "team_name" TEXT,
    "seed" INTEGER,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tournament_participant_pkey" PRIMARY KEY ("tournament_id","account_id")
);

-- CreateTable
CREATE TABLE "api_key" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "plan" "api_plan" NOT NULL DEFAULT 'free',
    "scopes" TEXT[],
    "last_used_at" TIMESTAMPTZ(3),
    "expires_at" TIMESTAMPTZ(3),
    "revoked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_usage_daily" (
    "api_key_id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "endpoint" TEXT NOT NULL,
    "requests" INTEGER NOT NULL DEFAULT 0,
    "errors" INTEGER NOT NULL DEFAULT 0,
    "throttled" INTEGER NOT NULL DEFAULT 0,
    "latency_ms_total" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "api_usage_daily_pkey" PRIMARY KEY ("api_key_id","day","endpoint")
);

-- CreateTable
CREATE TABLE "api_error_log" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "api_key_id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "status" SMALLINT NOT NULL,
    "code" TEXT,
    "message" TEXT,
    "occurred_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_error_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_endpoint" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "events" "webhook_event"[],
    "filter" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "disabled_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_delivery" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "endpoint_id" TEXT NOT NULL,
    "event" "webhook_event" NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "delivery_status" NOT NULL DEFAULT 'pending',
    "attempt" INTEGER NOT NULL DEFAULT 0,
    "response_status" SMALLINT,
    "response_body" TEXT,
    "next_attempt_at" TIMESTAMPTZ(3),
    "delivered_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developer_app" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "api_key_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "url" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "status" "moderation_status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "developer_app_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_version" (
    "id" SERIAL NOT NULL,
    "version" TEXT NOT NULL,
    "title" TEXT,
    "released_at" TIMESTAMPTZ(3),
    "detected_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "notes_url" TEXT,

    CONSTRAINT "game_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle" (
    "tank_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nation" TEXT NOT NULL,
    "type" "vehicle_type" NOT NULL,
    "tier" SMALLINT NOT NULL,
    "tag" TEXT,
    "description" TEXT,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "is_collectible" BOOLEAN NOT NULL DEFAULT false,
    "is_gift" BOOLEAN NOT NULL DEFAULT false,
    "is_wheeled" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "images" JSONB,
    "price_credit" INTEGER,
    "price_gold" INTEGER,
    "price_xp" INTEGER,
    "specs" JSONB,
    "prev_tank_ids" INTEGER[],
    "next_tanks" JSONB,
    "modules_tree" JSONB,
    "crew" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("tank_id")
);

-- CreateTable
CREATE TABLE "vehicle_profile" (
    "tank_id" INTEGER NOT NULL,
    "profile_id" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "module_ids" INTEGER[],
    "data" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_profile_pkey" PRIMARY KEY ("tank_id","profile_id")
);

-- CreateTable
CREATE TABLE "vehicle_spec_history" (
    "tank_id" INTEGER NOT NULL,
    "game_version_id" INTEGER NOT NULL,
    "specs" JSONB NOT NULL,
    "diff" JSONB,
    "captured_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_spec_history_pkey" PRIMARY KEY ("tank_id","game_version_id")
);

-- CreateTable
CREATE TABLE "module" (
    "module_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "module_type" NOT NULL,
    "nation" TEXT NOT NULL,
    "tier" SMALLINT NOT NULL,
    "price_credit" INTEGER,
    "weight" INTEGER,
    "image" TEXT,
    "tank_ids" INTEGER[],
    "data" JSONB,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "module_pkey" PRIMARY KEY ("module_id")
);

-- CreateTable
CREATE TABLE "provision" (
    "provision_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT,
    "type" "provision_type" NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "price_credit" INTEGER,
    "price_gold" INTEGER,
    "weight" INTEGER,
    "tank_ids" INTEGER[],
    "data" JSONB,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provision_pkey" PRIMARY KEY ("provision_id")
);

-- CreateTable
CREATE TABLE "crew_role" (
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "skills" TEXT[],
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crew_role_pkey" PRIMARY KEY ("role")
);

-- CreateTable
CREATE TABLE "crew_skill" (
    "skill" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "roles" TEXT[],
    "is_common" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "image" TEXT,
    "data" JSONB,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crew_skill_pkey" PRIMARY KEY ("skill")
);

-- CreateTable
CREATE TABLE "arena" (
    "arena_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "camouflage_type" TEXT,
    "description" TEXT,
    "image" TEXT,
    "size_meters" INTEGER,
    "modes" TEXT[],
    "data" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arena_pkey" PRIMARY KEY ("arena_id")
);

-- CreateTable
CREATE TABLE "achievement" (
    "name" TEXT NOT NULL,
    "section" TEXT,
    "type" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "condition" TEXT,
    "image" TEXT,
    "options" JSONB,
    "order" INTEGER,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "game_data_entry" (
    "game_version_id" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_data_entry_pkey" PRIMARY KEY ("game_version_id","kind","key")
);

-- CreateTable
CREATE TABLE "mod_device" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "account_id" BIGINT,
    "name" TEXT,
    "secret_hash" TEXT NOT NULL,
    "mod_version" TEXT,
    "game_version" TEXT,
    "last_seen_at" TIMESTAMPTZ(3),
    "revoked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mod_device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mod_bind_code" (
    "code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "account_id" BIGINT,
    "device_id" TEXT,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "used_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mod_bind_code_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "moe_threshold" (
    "tank_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "source" "threshold_source" NOT NULL,
    "p65" INTEGER NOT NULL,
    "p85" INTEGER NOT NULL,
    "p95" INTEGER NOT NULL,
    "p100" INTEGER,
    "sample_size" INTEGER,
    "captured_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moe_threshold_pkey" PRIMARY KEY ("tank_id","source","date")
);

-- CreateTable
CREATE TABLE "mastery_threshold" (
    "tank_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "source" "threshold_source" NOT NULL,
    "class_3" INTEGER NOT NULL,
    "class_2" INTEGER NOT NULL,
    "class_1" INTEGER NOT NULL,
    "master" INTEGER NOT NULL,
    "sample_size" INTEGER,
    "captured_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mastery_threshold_pkey" PRIMARY KEY ("tank_id","source","date")
);

-- CreateTable
CREATE TABLE "moe_progress" (
    "account_id" BIGINT NOT NULL,
    "tank_id" INTEGER NOT NULL,
    "marks" SMALLINT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "moving_damage" DOUBLE PRECISION,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moe_progress_pkey" PRIMARY KEY ("account_id","tank_id")
);

-- CreateTable
CREATE TABLE "player" (
    "account_id" BIGINT NOT NULL,
    "nickname" TEXT NOT NULL,
    "clan_id" BIGINT,
    "global_rating" INTEGER,
    "created_at" TIMESTAMPTZ(3),
    "last_battle_at" TIMESTAMPTZ(3),
    "logout_at" TIMESTAMPTZ(3),
    "lesta_updated_at" TIMESTAMPTZ(3),
    "tracking_tier" "tracking_tier" NOT NULL DEFAULT 'population',
    "last_polled_at" TIMESTAMPTZ(3),
    "next_poll_at" TIMESTAMPTZ(3),
    "last_viewed_at" TIMESTAMPTZ(3),
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "purge_after" TIMESTAMPTZ(3),
    "first_seen_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "player_nickname_history" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "account_id" BIGINT NOT NULL,
    "nickname" TEXT NOT NULL,
    "first_seen_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_nickname_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_clan_history" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "account_id" BIGINT NOT NULL,
    "clan_id" BIGINT NOT NULL,
    "role" "clan_role",
    "joined_at" TIMESTAMPTZ(3),
    "left_at" TIMESTAMPTZ(3),

    CONSTRAINT "player_clan_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_tank" (
    "account_id" BIGINT NOT NULL,
    "tank_id" INTEGER NOT NULL,
    "battles" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "mark_of_mastery" SMALLINT NOT NULL DEFAULT 0,
    "marks_on_gun" SMALLINT,
    "in_garage" BOOLEAN,
    "last_battle_at" TIMESTAMPTZ(3),
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_tank_pkey" PRIMARY KEY ("account_id","tank_id")
);

-- CreateTable
CREATE TABLE "replay" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "uploader_user_id" TEXT,
    "device_id" TEXT,
    "storage_key" TEXT NOT NULL,
    "timeline_key" TEXT,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "status" "replay_status" NOT NULL DEFAULT 'uploaded',
    "parse_error" TEXT,
    "visibility" "visibility" NOT NULL DEFAULT 'public',
    "game_version" TEXT,
    "arena_unique_id" BIGINT,
    "arena_id" TEXT,
    "battle_type" TEXT,
    "account_id" BIGINT,
    "tank_id" INTEGER,
    "result" "battle_result",
    "damage_dealt" INTEGER,
    "damage_assisted" INTEGER,
    "frags" INTEGER,
    "xp" INTEGER,
    "medals" TEXT[],
    "summary" JSONB,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "played_at" TIMESTAMPTZ(3),
    "parsed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "replay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "map_heatmap" (
    "arena_id" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "grid_size" SMALLINT NOT NULL,
    "samples" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "map_heatmap_pkey" PRIMARY KEY ("arena_id","mode","scope")
);

-- CreateTable
CREATE TABLE "play_session" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "account_id" BIGINT NOT NULL,
    "source" "session_source" NOT NULL,
    "kind" "session_kind" NOT NULL,
    "status" "session_status" NOT NULL DEFAULT 'open',
    "day" DATE,
    "started_at" TIMESTAMPTZ(3) NOT NULL,
    "ended_at" TIMESTAMPTZ(3),
    "last_activity_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "battles" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "damage_dealt" INTEGER NOT NULL DEFAULT 0,
    "damage_assisted" INTEGER NOT NULL DEFAULT 0,
    "damage_blocked" INTEGER NOT NULL DEFAULT 0,
    "frags" INTEGER NOT NULL DEFAULT 0,
    "spotted" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "survived_battles" INTEGER NOT NULL DEFAULT 0,
    "credits" INTEGER,
    "wn8" DOUBLE PRECISION,
    "brone_index" DOUBLE PRECISION,
    "tank_deltas" JSONB,
    "start_captured_at" TIMESTAMPTZ(3),
    "end_captured_at" TIMESTAMPTZ(3),
    "report_sent_at" TIMESTAMPTZ(3),

    CONSTRAINT "play_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "account_id" BIGINT NOT NULL,
    "session_id" TEXT,
    "device_id" TEXT,
    "arena_unique_id" BIGINT NOT NULL,
    "tank_id" INTEGER NOT NULL,
    "arena_id" TEXT NOT NULL,
    "battle_type" TEXT NOT NULL,
    "game_mode" TEXT,
    "result" "battle_result" NOT NULL,
    "team" SMALLINT,
    "damage_dealt" INTEGER NOT NULL,
    "damage_assisted_radio" INTEGER NOT NULL,
    "damage_assisted_track" INTEGER NOT NULL,
    "damage_assisted_stun" INTEGER NOT NULL,
    "damage_blocked" INTEGER NOT NULL,
    "damage_received" INTEGER NOT NULL,
    "spotted" INTEGER NOT NULL,
    "frags" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "free_xp" INTEGER,
    "credits" INTEGER,
    "credits_gross" INTEGER,
    "survived" BOOLEAN NOT NULL,
    "lifetime_sec" INTEGER,
    "capture_points" INTEGER NOT NULL DEFAULT 0,
    "dropped_capture_points" INTEGER NOT NULL DEFAULT 0,
    "shots_fired" INTEGER,
    "shots_hit" INTEGER,
    "shots_pierced" INTEGER,
    "shots" JSONB,
    "moe_percent" DOUBLE PRECISION,
    "moe_percent_delta" DOUBLE PRECISION,
    "marks_on_gun" SMALLINT,
    "queue_time_ms" INTEGER,
    "duration_sec" INTEGER,
    "loadout" JSONB,
    "achievements" TEXT[],
    "started_at" TIMESTAMPTZ(3) NOT NULL,
    "received_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "battle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "premium_offer" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "external_id" TEXT,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "image" TEXT,
    "tank_ids" INTEGER[],
    "contents" JSONB,
    "price_rub" DECIMAL(10,2),
    "price_gold" INTEGER,
    "old_price_rub" DECIMAL(10,2),
    "discount_percent" SMALLINT,
    "starts_at" TIMESTAMPTZ(3),
    "ends_at" TIMESTAMPTZ(3),
    "first_seen_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "premium_offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bonus_code" (
    "code" TEXT NOT NULL,
    "title" TEXT,
    "rewards" JSONB,
    "source" TEXT NOT NULL,
    "source_url" TEXT,
    "status" "bonus_code_status" NOT NULL DEFAULT 'unknown',
    "working_reports" INTEGER NOT NULL DEFAULT 0,
    "expired_reports" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMPTZ(3),
    "last_report_at" TIMESTAMPTZ(3),
    "discovered_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bonus_code_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "bonus_code_report" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "user_id" TEXT,
    "verdict" "bonus_code_verdict" NOT NULL,
    "ip_hash" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bonus_code_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_event" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "kind" "game_event_kind" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "image" TEXT,
    "data" JSONB,
    "starts_at" TIMESTAMPTZ(3) NOT NULL,
    "ends_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_event_progress" (
    "user_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_event_progress_pkey" PRIMARY KEY ("user_id","event_id")
);

-- CreateTable
CREATE TABLE "news_item" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "source" TEXT NOT NULL,
    "external_id" TEXT,
    "url" TEXT NOT NULL,
    "kind" "news_kind" NOT NULL DEFAULT 'news',
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "image" TEXT,
    "tank_ids" INTEGER[],
    "game_version_id" INTEGER,
    "published_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_snapshot" (
    "account_id" BIGINT NOT NULL,
    "mode" "stats_mode" NOT NULL,
    "captured_at" TIMESTAMPTZ(3) NOT NULL,
    "battles" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "draws" INTEGER NOT NULL,
    "damage_dealt" BIGINT NOT NULL,
    "damage_received" BIGINT NOT NULL,
    "frags" INTEGER NOT NULL,
    "spotted" INTEGER NOT NULL,
    "xp" BIGINT NOT NULL,
    "battle_avg_xp" INTEGER NOT NULL,
    "survived_battles" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "shots" INTEGER NOT NULL,
    "piercings" INTEGER NOT NULL,
    "piercings_received" INTEGER NOT NULL,
    "explosion_hits" INTEGER NOT NULL,
    "direct_hits_received" INTEGER NOT NULL,
    "no_damage_direct_hits_received" INTEGER NOT NULL,
    "explosion_hits_received" INTEGER,
    "capture_points" INTEGER NOT NULL,
    "dropped_capture_points" INTEGER NOT NULL,
    "avg_damage_blocked" DOUBLE PRECISION NOT NULL,
    "avg_damage_assisted" DOUBLE PRECISION,
    "avg_damage_assisted_radio" DOUBLE PRECISION,
    "avg_damage_assisted_track" DOUBLE PRECISION,
    "tanking_factor" DOUBLE PRECISION,
    "stun_assisted_damage" BIGINT NOT NULL,
    "stun_number" INTEGER NOT NULL,
    "max_damage" INTEGER,
    "max_damage_tank_id" INTEGER,
    "max_frags" INTEGER,
    "max_frags_tank_id" INTEGER,
    "max_xp" INTEGER,
    "max_xp_tank_id" INTEGER,
    "global_rating" INTEGER,

    CONSTRAINT "account_snapshot_pkey" PRIMARY KEY ("account_id","mode","captured_at")
);

-- CreateTable
CREATE TABLE "tank_snapshot" (
    "account_id" BIGINT NOT NULL,
    "tank_id" INTEGER NOT NULL,
    "mode" "stats_mode" NOT NULL,
    "captured_at" TIMESTAMPTZ(3) NOT NULL,
    "battles" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "draws" INTEGER NOT NULL,
    "damage_dealt" INTEGER NOT NULL,
    "damage_received" INTEGER NOT NULL,
    "frags" INTEGER NOT NULL,
    "spotted" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "battle_avg_xp" INTEGER NOT NULL,
    "survived_battles" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "shots" INTEGER NOT NULL,
    "piercings" INTEGER NOT NULL,
    "piercings_received" INTEGER NOT NULL,
    "explosion_hits" INTEGER NOT NULL,
    "direct_hits_received" INTEGER NOT NULL,
    "no_damage_direct_hits_received" INTEGER NOT NULL,
    "capture_points" INTEGER NOT NULL,
    "dropped_capture_points" INTEGER NOT NULL,
    "avg_damage_blocked" DOUBLE PRECISION NOT NULL,
    "tanking_factor" DOUBLE PRECISION,
    "stun_assisted_damage" INTEGER NOT NULL,
    "stun_number" INTEGER NOT NULL,
    "mark_of_mastery" SMALLINT NOT NULL,
    "marks_on_gun" SMALLINT,
    "max_frags" INTEGER,
    "max_xp" INTEGER,

    CONSTRAINT "tank_snapshot_pkey" PRIMARY KEY ("account_id","tank_id","mode","captured_at")
);

-- CreateTable
CREATE TABLE "tank_battle_delta" (
    "account_id" BIGINT NOT NULL,
    "tank_id" INTEGER NOT NULL,
    "mode" "stats_mode" NOT NULL,
    "captured_at" TIMESTAMPTZ(3) NOT NULL,
    "cohort" "skill_cohort" NOT NULL,
    "account_win_rate" DOUBLE PRECISION NOT NULL,
    "tier" SMALLINT NOT NULL,
    "battles" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,
    "losses" INTEGER NOT NULL,
    "draws" INTEGER NOT NULL,
    "damage_dealt" INTEGER NOT NULL,
    "damage_received" INTEGER NOT NULL,
    "damage_blocked" INTEGER NOT NULL,
    "stun_assisted_damage" INTEGER NOT NULL,
    "frags" INTEGER NOT NULL,
    "spotted" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "survived_battles" INTEGER NOT NULL,
    "hits" INTEGER NOT NULL,
    "shots" INTEGER NOT NULL,
    "piercings" INTEGER NOT NULL,
    "capture_points" INTEGER NOT NULL,
    "dropped_capture_points" INTEGER NOT NULL,
    "previous_captured_at" TIMESTAMPTZ(3),

    CONSTRAINT "tank_battle_delta_pkey" PRIMARY KEY ("account_id","tank_id","mode","captured_at")
);

-- CreateTable
CREATE TABLE "favorite" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "kind" "target_kind" NOT NULL,
    "target_id" BIGINT NOT NULL,
    "label" TEXT,
    "is_own" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "kind" "target_kind" NOT NULL,
    "target_id" BIGINT NOT NULL,
    "events" "notification_event"[],
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "account_id" BIGINT NOT NULL,
    "metric" "goal_metric" NOT NULL,
    "tank_id" INTEGER,
    "target" DOUBLE PRECISION NOT NULL,
    "baseline" DOUBLE PRECISION NOT NULL,
    "current" DOUBLE PRECISION,
    "status" "goal_status" NOT NULL DEFAULT 'active',
    "starts_at" TIMESTAMPTZ(3) NOT NULL,
    "ends_at" TIMESTAMPTZ(3) NOT NULL,
    "achieved_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badge_definition" (
    "code" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tier" SMALLINT NOT NULL DEFAULT 1,
    "criteria" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badge_definition_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "account_badge" (
    "account_id" BIGINT NOT NULL,
    "badge_code" TEXT NOT NULL,
    "context" JSONB,
    "awarded_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_badge_pkey" PRIMARY KEY ("account_id","badge_code")
);

-- CreateTable
CREATE TABLE "notification_settings" (
    "user_id" TEXT NOT NULL,
    "channels" "notification_channel"[],
    "events" "notification_event"[],
    "quiet_hours_start" SMALLINT,
    "quiet_hours_end" SMALLINT,
    "session_report" BOOLEAN NOT NULL DEFAULT true,
    "weekly_digest" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_settings_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "event" "notification_event" NOT NULL,
    "channel" "notification_channel" NOT NULL,
    "payload" JSONB NOT NULL,
    "dedupe_key" TEXT,
    "sent_at" TIMESTAMPTZ(3),
    "read_at" TIMESTAMPTZ(3),
    "failed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "push_subscription" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telegram_account" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "telegram_id" BIGINT NOT NULL,
    "username" TEXT,
    "language_code" TEXT,
    "chat_id" BIGINT,
    "linked_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(3),

    CONSTRAINT "telegram_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telegram_link_code" (
    "code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "used_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telegram_link_code_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "telegram_web_login" (
    "code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "used_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telegram_web_login_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "streamer_profile" (
    "user_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "account_id" BIGINT,
    "bio" TEXT,
    "avatar" TEXT,
    "links" JSONB,
    "schedule" JSONB,
    "is_live" BOOLEAN NOT NULL DEFAULT false,
    "live_tank_id" INTEGER,
    "live_checked_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "streamer_profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "streamer_integration" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "provider" "streamer_provider" NOT NULL,
    "external_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "token_expires_at" TIMESTAMPTZ(3),
    "scope" TEXT,
    "config" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "streamer_integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "overlay" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "account_id" BIGINT,
    "name" TEXT NOT NULL,
    "kind" "overlay_kind" NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'steel',
    "config" JSONB NOT NULL,
    "public_key" TEXT NOT NULL DEFAULT replace((gen_random_uuid())::text, '-'::text, ''::text),
    "is_pro" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "overlay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "streamer_user_id" TEXT NOT NULL,
    "account_id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "condition" JSONB NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RUB',
    "status" "challenge_status" NOT NULL DEFAULT 'pending',
    "donor_name" TEXT,
    "donor_message" TEXT,
    "donation_source" "streamer_provider",
    "donation_external_id" TEXT,
    "battle_id" TEXT,
    "progress" JSONB,
    "accepted_at" TIMESTAMPTZ(3),
    "expires_at" TIMESTAMPTZ(3),
    "resolved_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_log_entity_type_entity_id_idx" ON "audit_log"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_log_actor_user_id_created_at_idx" ON "audit_log"("actor_user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "audit_log"("created_at" DESC);

-- CreateIndex
CREATE INDEX "content_report_status_created_at_idx" ON "content_report"("status", "created_at");

-- CreateIndex
CREATE INDEX "content_report_target_type_target_id_idx" ON "content_report"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "data_deletion_request_status_requested_at_idx" ON "data_deletion_request"("status", "requested_at");

-- CreateIndex
CREATE INDEX "data_deletion_request_account_id_idx" ON "data_deletion_request"("account_id");

-- CreateIndex
CREATE INDEX "collector_job_metric_bucket_start_idx" ON "collector_job_metric"("bucket_start" DESC);

-- CreateIndex
CREATE INDEX "service_incident_started_at_idx" ON "service_incident"("started_at" DESC);

-- CreateIndex
CREATE INDEX "tank_server_stats_mode_period_win_rate_diff_idx" ON "tank_server_stats"("mode", "period", "win_rate_diff" DESC);

-- CreateIndex
CREATE INDEX "account_rating_period_wn8_idx" ON "account_rating"("period", "wn8" DESC);

-- CreateIndex
CREATE INDEX "account_rating_period_brone_index_idx" ON "account_rating"("period", "brone_index" DESC);

-- CreateIndex
CREATE INDEX "account_tank_rating_tank_id_period_wn8_idx" ON "account_tank_rating"("tank_id", "period", "wn8" DESC);

-- CreateIndex
CREATE INDEX "account_tank_rating_tank_id_period_avg_damage_idx" ON "account_tank_rating"("tank_id", "period", "avg_damage" DESC);

-- CreateIndex
CREATE INDEX "wn8_expected_value_date_idx" ON "wn8_expected_value"("date");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_user_id_idx" ON "session"("user_id");

-- CreateIndex
CREATE INDEX "account_user_id_idx" ON "account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_id_account_id_key" ON "account"("provider_id", "account_id");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "user_lesta_account_account_id_key" ON "user_lesta_account"("account_id");

-- CreateIndex
CREATE INDEX "user_lesta_account_user_id_idx" ON "user_lesta_account"("user_id");

-- CreateIndex
CREATE INDEX "user_lesta_account_token_expires_at_idx" ON "user_lesta_account"("token_expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_pending_card_id_key" ON "subscription"("pending_card_id");

-- CreateIndex
CREATE INDEX "subscription_status_current_period_end_idx" ON "subscription"("status", "current_period_end");

-- CreateIndex
CREATE INDEX "subscription_cancel_at_period_end_current_period_end_idx" ON "subscription"("cancel_at_period_end", "current_period_end");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_user_id_product_key" ON "subscription"("user_id", "product");

-- CreateIndex
CREATE UNIQUE INDEX "payment_yookassa_payment_id_key" ON "payment"("yookassa_payment_id");

-- CreateIndex
CREATE INDEX "payment_user_id_is_auto_charge_status_created_at_idx" ON "payment"("user_id", "is_auto_charge", "status", "created_at");

-- CreateIndex
CREATE INDEX "payment_subscription_id_idx" ON "payment"("subscription_id");

-- CreateIndex
CREATE INDEX "promo_redemption_user_id_idx" ON "promo_redemption"("user_id");

-- CreateIndex
CREATE INDEX "referral_referrer_user_id_idx" ON "referral"("referrer_user_id");

-- CreateIndex
CREATE INDEX "clan_tag_idx" ON "clan"("tag");

-- CreateIndex
CREATE INDEX "clan_tag_trgm_idx" ON "clan" USING GIN ("tag" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "clan_name_trgm_idx" ON "clan" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "clan_member_clan_id_idx" ON "clan_member"("clan_id");

-- CreateIndex
CREATE INDEX "clan_member_event_clan_id_occurred_at_idx" ON "clan_member_event"("clan_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "clan_member_event_account_id_occurred_at_idx" ON "clan_member_event"("account_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "globalmap_province_front_id_idx" ON "globalmap_province"("front_id");

-- CreateIndex
CREATE INDEX "globalmap_province_owner_clan_id_idx" ON "globalmap_province"("owner_clan_id");

-- CreateIndex
CREATE INDEX "clan_workspace_owner_user_id_idx" ON "clan_workspace"("owner_user_id");

-- CreateIndex
CREATE INDEX "clan_event_clan_id_starts_at_idx" ON "clan_event"("clan_id", "starts_at");

-- CreateIndex
CREATE INDEX "clan_event_remind_at_idx" ON "clan_event"("remind_at");

-- CreateIndex
CREATE INDEX "clan_attendance_account_id_idx" ON "clan_attendance"("account_id");

-- CreateIndex
CREATE INDEX "recruit_candidate_clan_id_status_idx" ON "recruit_candidate"("clan_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "recruit_candidate_clan_id_account_id_key" ON "recruit_candidate"("clan_id", "account_id");

-- CreateIndex
CREATE INDEX "clan_integration_clan_id_idx" ON "clan_integration"("clan_id");

-- CreateIndex
CREATE UNIQUE INDEX "clan_integration_kind_external_id_key" ON "clan_integration"("kind", "external_id");

-- CreateIndex
CREATE INDEX "build_tank_id_status_likes_count_idx" ON "build"("tank_id", "status", "likes_count" DESC);

-- CreateIndex
CREATE INDEX "build_author_user_id_idx" ON "build"("author_user_id");

-- CreateIndex
CREATE INDEX "build_like_user_id_idx" ON "build_like"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "guide_slug_key" ON "guide"("slug");

-- CreateIndex
CREATE INDEX "guide_kind_status_published_at_idx" ON "guide"("kind", "status", "published_at" DESC);

-- CreateIndex
CREATE INDEX "guide_tank_id_idx" ON "guide"("tank_id");

-- CreateIndex
CREATE INDEX "guide_arena_id_idx" ON "guide"("arena_id");

-- CreateIndex
CREATE INDEX "guide_author_user_id_idx" ON "guide"("author_user_id");

-- CreateIndex
CREATE INDEX "guide_like_user_id_idx" ON "guide_like"("user_id");

-- CreateIndex
CREATE INDEX "comment_target_target_id_created_at_idx" ON "comment"("target", "target_id", "created_at");

-- CreateIndex
CREATE INDEX "comment_author_user_id_idx" ON "comment"("author_user_id");

-- CreateIndex
CREATE INDEX "platoon_post_status_expires_at_idx" ON "platoon_post"("status", "expires_at");

-- CreateIndex
CREATE INDEX "recruiting_post_status_created_at_idx" ON "recruiting_post"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "recruiting_post_clan_id_idx" ON "recruiting_post"("clan_id");

-- CreateIndex
CREATE UNIQUE INDEX "tactic_board_share_token_key" ON "tactic_board"("share_token");

-- CreateIndex
CREATE INDEX "tactic_board_owner_user_id_idx" ON "tactic_board"("owner_user_id");

-- CreateIndex
CREATE INDEX "tactic_board_arena_id_idx" ON "tactic_board"("arena_id");

-- CreateIndex
CREATE INDEX "coach_profile_is_active_rating_idx" ON "coach_profile"("is_active", "rating" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "coaching_order_payment_id_key" ON "coaching_order"("payment_id");

-- CreateIndex
CREATE INDEX "coaching_order_coach_user_id_status_idx" ON "coaching_order"("coach_user_id", "status");

-- CreateIndex
CREATE INDEX "coaching_order_student_user_id_idx" ON "coaching_order"("student_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tournament_slug_key" ON "tournament"("slug");

-- CreateIndex
CREATE INDEX "tournament_status_starts_at_idx" ON "tournament"("status", "starts_at");

-- CreateIndex
CREATE UNIQUE INDEX "api_key_prefix_key" ON "api_key"("prefix");

-- CreateIndex
CREATE UNIQUE INDEX "api_key_key_hash_key" ON "api_key"("key_hash");

-- CreateIndex
CREATE INDEX "api_key_user_id_idx" ON "api_key"("user_id");

-- CreateIndex
CREATE INDEX "api_usage_daily_day_idx" ON "api_usage_daily"("day");

-- CreateIndex
CREATE INDEX "api_error_log_api_key_id_occurred_at_idx" ON "api_error_log"("api_key_id", "occurred_at" DESC);

-- CreateIndex
CREATE INDEX "webhook_endpoint_user_id_idx" ON "webhook_endpoint"("user_id");

-- CreateIndex
CREATE INDEX "webhook_endpoint_is_active_idx" ON "webhook_endpoint"("is_active");

-- CreateIndex
CREATE INDEX "webhook_delivery_endpoint_id_created_at_idx" ON "webhook_delivery"("endpoint_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "webhook_delivery_status_next_attempt_at_idx" ON "webhook_delivery"("status", "next_attempt_at");

-- CreateIndex
CREATE UNIQUE INDEX "developer_app_slug_key" ON "developer_app"("slug");

-- CreateIndex
CREATE INDEX "developer_app_status_idx" ON "developer_app"("status");

-- CreateIndex
CREATE UNIQUE INDEX "game_version_version_key" ON "game_version"("version");

-- CreateIndex
CREATE INDEX "game_version_released_at_idx" ON "game_version"("released_at");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_slug_key" ON "vehicle"("slug");

-- CreateIndex
CREATE INDEX "vehicle_tier_type_idx" ON "vehicle"("tier", "type");

-- CreateIndex
CREATE INDEX "vehicle_nation_idx" ON "vehicle"("nation");

-- CreateIndex
CREATE INDEX "vehicle_name_trgm_idx" ON "vehicle" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "vehicle_spec_history_game_version_id_idx" ON "vehicle_spec_history"("game_version_id");

-- CreateIndex
CREATE INDEX "module_type_idx" ON "module"("type");

-- CreateIndex
CREATE INDEX "provision_type_idx" ON "provision"("type");

-- CreateIndex
CREATE UNIQUE INDEX "arena_slug_key" ON "arena"("slug");

-- CreateIndex
CREATE INDEX "game_data_entry_kind_key_idx" ON "game_data_entry"("kind", "key");

-- CreateIndex
CREATE INDEX "mod_device_user_id_idx" ON "mod_device"("user_id");

-- CreateIndex
CREATE INDEX "mod_device_account_id_idx" ON "mod_device"("account_id");

-- CreateIndex
CREATE INDEX "mod_bind_code_user_id_idx" ON "mod_bind_code"("user_id");

-- CreateIndex
CREATE INDEX "mod_bind_code_expires_at_idx" ON "mod_bind_code"("expires_at");

-- CreateIndex
CREATE INDEX "moe_threshold_date_idx" ON "moe_threshold"("date");

-- CreateIndex
CREATE INDEX "mastery_threshold_date_idx" ON "mastery_threshold"("date");

-- CreateIndex
CREATE INDEX "player_nickname_trgm_idx" ON "player" USING GIN ("nickname" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "player_nickname_idx" ON "player"("nickname");

-- CreateIndex
CREATE INDEX "player_clan_id_idx" ON "player"("clan_id");

-- CreateIndex
CREATE INDEX "player_tracking_tier_next_poll_at_idx" ON "player"("tracking_tier", "next_poll_at");

-- CreateIndex
CREATE INDEX "player_last_battle_at_idx" ON "player"("last_battle_at");

-- CreateIndex
CREATE INDEX "player_nickname_history_trgm_idx" ON "player_nickname_history" USING GIN ("nickname" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "player_nickname_history_account_id_nickname_key" ON "player_nickname_history"("account_id", "nickname");

-- CreateIndex
CREATE INDEX "player_clan_history_account_id_joined_at_idx" ON "player_clan_history"("account_id", "joined_at" DESC);

-- CreateIndex
CREATE INDEX "player_clan_history_clan_id_idx" ON "player_clan_history"("clan_id");

-- CreateIndex
CREATE INDEX "player_tank_tank_id_idx" ON "player_tank"("tank_id");

-- CreateIndex
CREATE UNIQUE INDEX "replay_storage_key_key" ON "replay"("storage_key");

-- CreateIndex
CREATE UNIQUE INDEX "replay_sha256_key" ON "replay"("sha256");

-- CreateIndex
CREATE INDEX "replay_tank_id_damage_dealt_idx" ON "replay"("tank_id", "damage_dealt" DESC);

-- CreateIndex
CREATE INDEX "replay_arena_id_played_at_idx" ON "replay"("arena_id", "played_at" DESC);

-- CreateIndex
CREATE INDEX "replay_account_id_played_at_idx" ON "replay"("account_id", "played_at" DESC);

-- CreateIndex
CREATE INDEX "replay_uploader_user_id_created_at_idx" ON "replay"("uploader_user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "replay_status_idx" ON "replay"("status");

-- CreateIndex
CREATE INDEX "replay_is_featured_played_at_idx" ON "replay"("is_featured", "played_at" DESC);

-- CreateIndex
CREATE INDEX "play_session_account_id_started_at_idx" ON "play_session"("account_id", "started_at" DESC);

-- CreateIndex
CREATE INDEX "play_session_status_last_activity_at_idx" ON "play_session"("status", "last_activity_at");

-- CreateIndex
CREATE UNIQUE INDEX "play_session_account_id_source_kind_day_key" ON "play_session"("account_id", "source", "kind", "day");

-- CreateIndex
CREATE INDEX "battle_account_id_started_at_idx" ON "battle"("account_id", "started_at" DESC);

-- CreateIndex
CREATE INDEX "battle_session_id_idx" ON "battle"("session_id");

-- CreateIndex
CREATE INDEX "battle_tank_id_started_at_idx" ON "battle"("tank_id", "started_at" DESC);

-- CreateIndex
CREATE INDEX "battle_arena_id_idx" ON "battle"("arena_id");

-- CreateIndex
CREATE UNIQUE INDEX "battle_account_id_arena_unique_id_key" ON "battle"("account_id", "arena_unique_id");

-- CreateIndex
CREATE INDEX "premium_offer_tank_ids_idx" ON "premium_offer" USING GIN ("tank_ids");

-- CreateIndex
CREATE INDEX "premium_offer_starts_at_idx" ON "premium_offer"("starts_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "premium_offer_source_external_id_starts_at_key" ON "premium_offer"("source", "external_id", "starts_at");

-- CreateIndex
CREATE INDEX "bonus_code_status_discovered_at_idx" ON "bonus_code"("status", "discovered_at" DESC);

-- CreateIndex
CREATE INDEX "bonus_code_report_code_created_at_idx" ON "bonus_code_report"("code", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "bonus_code_report_code_user_id_key" ON "bonus_code_report"("code", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_event_slug_key" ON "game_event"("slug");

-- CreateIndex
CREATE INDEX "game_event_kind_starts_at_idx" ON "game_event"("kind", "starts_at");

-- CreateIndex
CREATE INDEX "game_event_starts_at_ends_at_idx" ON "game_event"("starts_at", "ends_at");

-- CreateIndex
CREATE UNIQUE INDEX "news_item_url_key" ON "news_item"("url");

-- CreateIndex
CREATE INDEX "news_item_published_at_idx" ON "news_item"("published_at" DESC);

-- CreateIndex
CREATE INDEX "news_item_tank_ids_idx" ON "news_item" USING GIN ("tank_ids");

-- CreateIndex
CREATE INDEX "tank_snapshot_tank_id_captured_at_idx" ON "tank_snapshot"("tank_id", "captured_at" DESC);

-- CreateIndex
CREATE INDEX "tank_battle_delta_captured_at_idx" ON "tank_battle_delta"("captured_at" DESC);

-- CreateIndex
CREATE INDEX "tank_battle_delta_tank_id_captured_at_idx" ON "tank_battle_delta"("tank_id", "captured_at" DESC);

-- CreateIndex
CREATE INDEX "favorite_kind_target_id_idx" ON "favorite"("kind", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_user_id_kind_target_id_key" ON "favorite"("user_id", "kind", "target_id");

-- CreateIndex
CREATE INDEX "follow_kind_target_id_idx" ON "follow"("kind", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "follow_user_id_kind_target_id_key" ON "follow"("user_id", "kind", "target_id");

-- CreateIndex
CREATE INDEX "goal_user_id_status_idx" ON "goal"("user_id", "status");

-- CreateIndex
CREATE INDEX "goal_status_ends_at_idx" ON "goal"("status", "ends_at");

-- CreateIndex
CREATE INDEX "account_badge_badge_code_idx" ON "account_badge"("badge_code");

-- CreateIndex
CREATE INDEX "notification_user_id_created_at_idx" ON "notification"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "notification_sent_at_idx" ON "notification"("sent_at");

-- CreateIndex
CREATE UNIQUE INDEX "notification_user_id_channel_dedupe_key_key" ON "notification"("user_id", "channel", "dedupe_key");

-- CreateIndex
CREATE UNIQUE INDEX "push_subscription_endpoint_key" ON "push_subscription"("endpoint");

-- CreateIndex
CREATE INDEX "push_subscription_user_id_idx" ON "push_subscription"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_account_user_id_key" ON "telegram_account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_account_telegram_id_key" ON "telegram_account"("telegram_id");

-- CreateIndex
CREATE INDEX "telegram_link_code_user_id_idx" ON "telegram_link_code"("user_id");

-- CreateIndex
CREATE INDEX "telegram_web_login_user_id_idx" ON "telegram_web_login"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "streamer_profile_slug_key" ON "streamer_profile"("slug");

-- CreateIndex
CREATE INDEX "streamer_profile_is_live_idx" ON "streamer_profile"("is_live");

-- CreateIndex
CREATE INDEX "streamer_profile_account_id_idx" ON "streamer_profile"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "streamer_integration_provider_external_id_key" ON "streamer_integration"("provider", "external_id");

-- CreateIndex
CREATE UNIQUE INDEX "streamer_integration_user_id_provider_key" ON "streamer_integration"("user_id", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "overlay_public_key_key" ON "overlay"("public_key");

-- CreateIndex
CREATE INDEX "overlay_user_id_idx" ON "overlay"("user_id");

-- CreateIndex
CREATE INDEX "challenge_streamer_user_id_status_idx" ON "challenge"("streamer_user_id", "status");

-- CreateIndex
CREATE INDEX "challenge_account_id_status_idx" ON "challenge"("account_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_donation_source_donation_external_id_key" ON "challenge"("donation_source", "donation_external_id");

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_report" ADD CONSTRAINT "content_report_reporter_user_id_fkey" FOREIGN KEY ("reporter_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_deletion_request" ADD CONSTRAINT "data_deletion_request_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_rating" ADD CONSTRAINT "account_rating_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "player"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_tank_rating" ADD CONSTRAINT "account_tank_rating_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "player"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lesta_account" ADD CONSTRAINT "user_lesta_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lesta_account" ADD CONSTRAINT "user_lesta_account_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "player"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo_redemption" ADD CONSTRAINT "promo_redemption_code_fkey" FOREIGN KEY ("code") REFERENCES "promo_code"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promo_redemption" ADD CONSTRAINT "promo_redemption_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral" ADD CONSTRAINT "referral_referred_user_id_fkey" FOREIGN KEY ("referred_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral" ADD CONSTRAINT "referral_referrer_user_id_fkey" FOREIGN KEY ("referrer_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clan_member" ADD CONSTRAINT "clan_member_clan_id_fkey" FOREIGN KEY ("clan_id") REFERENCES "clan"("clan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clan_member" ADD CONSTRAINT "clan_member_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "player"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clan_member_event" ADD CONSTRAINT "clan_member_event_clan_id_fkey" FOREIGN KEY ("clan_id") REFERENCES "clan"("clan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clan_snapshot" ADD CONSTRAINT "clan_snapshot_clan_id_fkey" FOREIGN KEY ("clan_id") REFERENCES "clan"("clan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clan_stronghold" ADD CONSTRAINT "clan_stronghold_clan_id_fkey" FOREIGN KEY ("clan_id") REFERENCES "clan"("clan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "globalmap_province" ADD CONSTRAINT "globalmap_province_owner_clan_id_fkey" FOREIGN KEY ("owner_clan_id") REFERENCES "clan"("clan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clan_workspace" ADD CONSTRAINT "clan_workspace_clan_id_fkey" FOREIGN KEY ("clan_id") REFERENCES "clan"("clan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clan_workspace" ADD CONSTRAINT "clan_workspace_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clan_event" ADD CONSTRAINT "clan_event_clan_id_fkey" FOREIGN KEY ("clan_id") REFERENCES "clan_workspace"("clan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clan_attendance" ADD CONSTRAINT "clan_attendance_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "clan_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruit_candidate" ADD CONSTRAINT "recruit_candidate_clan_id_fkey" FOREIGN KEY ("clan_id") REFERENCES "clan_workspace"("clan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruit_candidate" ADD CONSTRAINT "recruit_candidate_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clan_integration" ADD CONSTRAINT "clan_integration_clan_id_fkey" FOREIGN KEY ("clan_id") REFERENCES "clan_workspace"("clan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "build" ADD CONSTRAINT "build_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "build" ADD CONSTRAINT "build_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "vehicle"("tank_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "build" ADD CONSTRAINT "build_game_version_id_fkey" FOREIGN KEY ("game_version_id") REFERENCES "game_version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "build_like" ADD CONSTRAINT "build_like_build_id_fkey" FOREIGN KEY ("build_id") REFERENCES "build"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "build_like" ADD CONSTRAINT "build_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide" ADD CONSTRAINT "guide_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_like" ADD CONSTRAINT "guide_like_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_like" ADD CONSTRAINT "guide_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platoon_post" ADD CONSTRAINT "platoon_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruiting_post" ADD CONSTRAINT "recruiting_post_clan_id_fkey" FOREIGN KEY ("clan_id") REFERENCES "clan"("clan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recruiting_post" ADD CONSTRAINT "recruiting_post_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tactic_board" ADD CONSTRAINT "tactic_board_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coach_profile" ADD CONSTRAINT "coach_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_order" ADD CONSTRAINT "coaching_order_coach_user_id_fkey" FOREIGN KEY ("coach_user_id") REFERENCES "coach_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaching_order" ADD CONSTRAINT "coaching_order_student_user_id_fkey" FOREIGN KEY ("student_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament" ADD CONSTRAINT "tournament_organizer_user_id_fkey" FOREIGN KEY ("organizer_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_participant" ADD CONSTRAINT "tournament_participant_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_usage_daily" ADD CONSTRAINT "api_usage_daily_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "api_key"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_error_log" ADD CONSTRAINT "api_error_log_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "api_key"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_endpoint" ADD CONSTRAINT "webhook_endpoint_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_delivery" ADD CONSTRAINT "webhook_delivery_endpoint_id_fkey" FOREIGN KEY ("endpoint_id") REFERENCES "webhook_endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_app" ADD CONSTRAINT "developer_app_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "developer_app" ADD CONSTRAINT "developer_app_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "api_key"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_profile" ADD CONSTRAINT "vehicle_profile_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "vehicle"("tank_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_spec_history" ADD CONSTRAINT "vehicle_spec_history_tank_id_fkey" FOREIGN KEY ("tank_id") REFERENCES "vehicle"("tank_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_spec_history" ADD CONSTRAINT "vehicle_spec_history_game_version_id_fkey" FOREIGN KEY ("game_version_id") REFERENCES "game_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_data_entry" ADD CONSTRAINT "game_data_entry_game_version_id_fkey" FOREIGN KEY ("game_version_id") REFERENCES "game_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mod_device" ADD CONSTRAINT "mod_device_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mod_bind_code" ADD CONSTRAINT "mod_bind_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moe_progress" ADD CONSTRAINT "moe_progress_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "player"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_nickname_history" ADD CONSTRAINT "player_nickname_history_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "player"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_clan_history" ADD CONSTRAINT "player_clan_history_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "player"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_tank" ADD CONSTRAINT "player_tank_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "player"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replay" ADD CONSTRAINT "replay_uploader_user_id_fkey" FOREIGN KEY ("uploader_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replay" ADD CONSTRAINT "replay_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "mod_device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "play_session" ADD CONSTRAINT "play_session_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "player"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle" ADD CONSTRAINT "battle_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "player"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle" ADD CONSTRAINT "battle_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "play_session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "battle" ADD CONSTRAINT "battle_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "mod_device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonus_code_report" ADD CONSTRAINT "bonus_code_report_code_fkey" FOREIGN KEY ("code") REFERENCES "bonus_code"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonus_code_report" ADD CONSTRAINT "bonus_code_report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_event_progress" ADD CONSTRAINT "user_event_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_event_progress" ADD CONSTRAINT "user_event_progress_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "game_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_item" ADD CONSTRAINT "news_item_game_version_id_fkey" FOREIGN KEY ("game_version_id") REFERENCES "game_version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow" ADD CONSTRAINT "follow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal" ADD CONSTRAINT "goal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_badge" ADD CONSTRAINT "account_badge_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "player"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_badge" ADD CONSTRAINT "account_badge_badge_code_fkey" FOREIGN KEY ("badge_code") REFERENCES "badge_definition"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_settings" ADD CONSTRAINT "notification_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_subscription" ADD CONSTRAINT "push_subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telegram_account" ADD CONSTRAINT "telegram_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telegram_link_code" ADD CONSTRAINT "telegram_link_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telegram_web_login" ADD CONSTRAINT "telegram_web_login_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streamer_profile" ADD CONSTRAINT "streamer_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streamer_integration" ADD CONSTRAINT "streamer_integration_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overlay" ADD CONSTRAINT "overlay_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge" ADD CONSTRAINT "challenge_streamer_user_id_fkey" FOREIGN KEY ("streamer_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
