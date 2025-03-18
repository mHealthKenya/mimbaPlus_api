/*
  Warnings:

  - Added the required column `facilityId` to the `Admission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admission" ADD COLUMN     "facilityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
