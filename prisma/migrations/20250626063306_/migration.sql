/*
  Warnings:

  - You are about to drop the column `hasDelivered` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hasDeliveredOnly` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hasDelivered",
DROP COLUMN "hasDeliveredOnly";
