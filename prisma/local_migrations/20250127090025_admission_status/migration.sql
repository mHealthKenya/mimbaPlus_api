-- CreateEnum
CREATE TYPE "AdmissionStatus" AS ENUM ('Admitted', 'Discharged');

-- AlterTable
ALTER TABLE "Admission" ADD COLUMN     "status" "AdmissionStatus" NOT NULL DEFAULT 'Admitted';
