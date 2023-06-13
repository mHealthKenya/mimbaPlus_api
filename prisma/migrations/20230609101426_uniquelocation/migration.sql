/*
  Warnings:

  - A unique constraint covering the columns `[location_name]` on the table `LocationsCovered` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LocationsCovered_location_name_key" ON "LocationsCovered"("location_name");
