-- DropForeignKey
ALTER TABLE "WalletTransaction" DROP CONSTRAINT "WalletTransaction_clinicVisitId_fkey";

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "dischargeId" TEXT,
ALTER COLUMN "clinicVisitId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_dischargeId_fkey" FOREIGN KEY ("dischargeId") REFERENCES "Discharge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_clinicVisitId_fkey" FOREIGN KEY ("clinicVisitId") REFERENCES "ClinicVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
