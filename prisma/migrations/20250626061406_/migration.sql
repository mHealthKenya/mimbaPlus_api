/*
  Warnings:

  - Made the column `hasDelivered` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "hasDelivered" SET NOT NULL;
