/*
  Warnings:

  - You are about to drop the column `order` on the `priorities` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "priorities_userId_order_key";

-- AlterTable
ALTER TABLE "priorities" DROP COLUMN "order";
