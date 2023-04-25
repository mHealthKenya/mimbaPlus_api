/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `LocationsCovered` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LocationsCovered" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Roles" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age";

-- CreateTable
CREATE TABLE "BioData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "last_monthly_period" TIMESTAMP(3) NOT NULL,
    "expected_delivery_date" TIMESTAMP(3) NOT NULL,
    "pregnancy_period" INTEGER NOT NULL,
    "last_clinic_visit" TIMESTAMP(3) NOT NULL,
    "facilityId" TEXT NOT NULL,
    "previous_pregnancies" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BioData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contact_name" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incidents" (
    "id" TEXT NOT NULL,
    "reportedById" TEXT NOT NULL,
    "motherId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "incident_time" TIMESTAMP(3) NOT NULL,
    "incident_duration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incidents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BioData" ADD CONSTRAINT "BioData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BioData" ADD CONSTRAINT "BioData_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidents" ADD CONSTRAINT "Incidents_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidents" ADD CONSTRAINT "Incidents_motherId_fkey" FOREIGN KEY ("motherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
