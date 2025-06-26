/*
  Warnings:

  - You are about to drop the column `hadDelivered` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hadDelivered",
ADD COLUMN     "hasDelivered" BOOLEAN NOT NULL DEFAULT false;
