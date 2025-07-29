-- CreateEnum
CREATE TYPE "CompanyTier" AS ENUM ('TIER_1', 'TIER_2', 'TIER_3', 'BACKLOG');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "tier" "CompanyTier" NOT NULL DEFAULT 'BACKLOG';
