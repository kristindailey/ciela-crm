-- CreateEnum
CREATE TYPE "OfficePolicy" AS ENUM ('REMOTE', 'HYBRID', 'IN_OFFICE');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "employeeCount" INTEGER,
ADD COLUMN     "hqLocation" TEXT,
ADD COLUMN     "localLocation" TEXT,
ADD COLUMN     "officePolicy" "OfficePolicy";
