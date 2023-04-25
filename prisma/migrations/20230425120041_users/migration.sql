-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "f_name" TEXT NOT NULL,
    "l_name" TEXT NOT NULL,
    "locationsCoveredId" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT NOT NULL,
    "national_id" TEXT,
    "pin" INTEGER NOT NULL,
    "rolesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationsCovered" (
    "id" TEXT NOT NULL,
    "location_name" TEXT NOT NULL,

    CONSTRAINT "LocationsCovered_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_locationsCoveredId_fkey" FOREIGN KEY ("locationsCoveredId") REFERENCES "LocationsCovered"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rolesId_fkey" FOREIGN KEY ("rolesId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
