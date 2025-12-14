-- AlterTable
ALTER TABLE "BioData" ADD COLUMN     "delivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deliveryMethod" TEXT;
