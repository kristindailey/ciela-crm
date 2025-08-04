/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `companies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "companies_name_userId_key" ON "companies"("name", "userId");
