/*
  Warnings:

  - A unique constraint covering the columns `[userId,position]` on the table `wins` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `wins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wins" ADD COLUMN     "position" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "wins_userId_position_key" ON "wins"("userId", "position");
