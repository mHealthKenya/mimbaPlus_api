-- CreateEnum
CREATE TYPE "DischargeRequestStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- AlterTable
ALTER TABLE "DischargeRequest" ADD COLUMN     "status" "DischargeRequestStatus" NOT NULL DEFAULT 'Pending';
