-- CreateEnum
CREATE TYPE "MessageCategory" AS ENUM ('GENERAL', 'GESTATION_PERIOD', 'HIGH_RISK');

-- DropForeignKey
ALTER TABLE "ScheduledMessage" DROP CONSTRAINT "ScheduledMessage_userId_fkey";

-- AlterTable
ALTER TABLE "ScheduledMessage" ADD COLUMN     "category" "MessageCategory" NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "gestationTarget" DOUBLE PRECISION,
ADD COLUMN     "riskCondition" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "scheduledAt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ScheduledMessage" ADD CONSTRAINT "ScheduledMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
