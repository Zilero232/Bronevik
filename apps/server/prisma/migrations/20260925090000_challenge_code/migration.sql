-- AlterTable
ALTER TABLE "challenge" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "challenge_streamer_user_id_code_key" ON "challenge"("streamer_user_id", "code");
