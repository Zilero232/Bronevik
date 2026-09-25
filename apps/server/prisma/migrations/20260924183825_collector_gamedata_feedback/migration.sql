-- CreateEnum
CREATE TYPE "game_source" AS ENUM ('RU', 'PT_RU');

-- AlterEnum
ALTER TYPE "module_type" ADD VALUE 'fuel_tank';

-- AlterEnum
ALTER TYPE "percentile_distribution" ADD VALUE 'bronya';

-- AlterEnum
ALTER TYPE "provision_type" ADD VALUE 'consumable';

-- DropIndex
DROP INDEX "game_version_version_key";

-- AlterTable
ALTER TABLE "arena" ADD COLUMN     "description_key" TEXT,
ADD COLUMN     "name_key" TEXT,
ADD COLUMN     "numeric_id" INTEGER;

-- AlterTable
ALTER TABLE "clan" ADD COLUMN     "is_tracked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "crew_skill" ADD COLUMN     "description_key" TEXT,
ADD COLUMN     "name_key" TEXT;

-- AlterTable
ALTER TABLE "game_version" ADD COLUMN     "commit_sha" TEXT,
ADD COLUMN     "is_test" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "source" "game_source" NOT NULL DEFAULT 'RU';

-- AlterTable
ALTER TABLE "module" ADD COLUMN     "description_key" TEXT,
ADD COLUMN     "name_key" TEXT;

-- AlterTable
ALTER TABLE "provision" ADD COLUMN     "description_key" TEXT,
ADD COLUMN     "name_key" TEXT;

-- AlterTable
ALTER TABLE "tank_battle_delta" ALTER COLUMN "tier" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tank_server_stats" ADD COLUMN     "samples" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "vehicle" ADD COLUMN     "description_key" TEXT,
ADD COLUMN     "name_key" TEXT;

-- AlterTable
ALTER TABLE "vehicle_spec_history" ADD COLUMN     "base_game_version_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "arena_numeric_id_key" ON "arena"("numeric_id");

-- CreateIndex
CREATE INDEX "clan_is_tracked_idx" ON "clan"("is_tracked");

-- CreateIndex
CREATE UNIQUE INDEX "game_version_source_version_key" ON "game_version"("source", "version");

-- CreateIndex
CREATE INDEX "vehicle_spec_history_base_game_version_id_idx" ON "vehicle_spec_history"("base_game_version_id");

-- AddForeignKey
ALTER TABLE "vehicle_spec_history" ADD CONSTRAINT "vehicle_spec_history_base_game_version_id_fkey" FOREIGN KEY ("base_game_version_id") REFERENCES "game_version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

