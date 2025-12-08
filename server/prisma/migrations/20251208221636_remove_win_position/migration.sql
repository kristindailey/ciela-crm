/*
  Warnings:

  - You are about to drop the column `position` on the `wins` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "wins_userId_position_key";

-- AlterTable
ALTER TABLE "wins" DROP COLUMN "position";
