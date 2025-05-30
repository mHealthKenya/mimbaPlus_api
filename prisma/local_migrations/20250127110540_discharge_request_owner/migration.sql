/*
  Warnings:

  - Added the required column `userId` to the `DischargeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DischargeRequest" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DischargeRequest" ADD CONSTRAINT "DischargeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
