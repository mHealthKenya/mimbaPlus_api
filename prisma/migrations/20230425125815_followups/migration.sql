/*
  Warnings:

  - You are about to drop the column `contact_name` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `contact_number` on the `Facility` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Facility` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Facility" DROP COLUMN "contact_name",
DROP COLUMN "contact_number",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FollowUpRequests" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "chvId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUpRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "files" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CHVTargets" (
    "id" TEXT NOT NULL,
    "setTarget" INTEGER NOT NULL,
    "current" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CHVTargets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpRequests" ADD CONSTRAINT "FollowUpRequests_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpRequests" ADD CONSTRAINT "FollowUpRequests_chvId_fkey" FOREIGN KEY ("chvId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpRequests" ADD CONSTRAINT "FollowUpRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
