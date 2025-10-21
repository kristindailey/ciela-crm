/*
  Warnings:

  - You are about to drop the column `glassdoorSweRating` on the `companies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "glassdoorSweRating",
ADD COLUMN     "blindRating" DECIMAL(2,1);
