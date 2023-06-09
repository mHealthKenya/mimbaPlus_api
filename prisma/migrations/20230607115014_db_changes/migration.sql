/*
  Warnings:

  - You are about to drop the column `pin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rolesId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Roles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rolesId_fkey";

-- AlterTable
ALTER TABLE "BioData" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pin",
DROP COLUMN "rolesId",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Mother';

-- DropTable
DROP TABLE "Roles";
