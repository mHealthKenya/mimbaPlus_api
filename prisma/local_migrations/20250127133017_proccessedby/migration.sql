-- AlterTable
ALTER TABLE "DischargeRequest" ADD COLUMN     "processedById" TEXT;

-- AddForeignKey
ALTER TABLE "DischargeRequest" ADD CONSTRAINT "DischargeRequest_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
