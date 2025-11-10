/*
  Warnings:

  - Added the required column `interactionDate` to the `interactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "interactions" ADD COLUMN     "interactionDate" TIMESTAMP(3) NOT NULL;
