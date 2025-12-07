/*
  Warnings:

  - A unique constraint covering the columns `[userId,position]` on the table `priorities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `priorities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "priorities" ADD COLUMN     "position" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "priorities_userId_position_key" ON "priorities"("userId", "position");
