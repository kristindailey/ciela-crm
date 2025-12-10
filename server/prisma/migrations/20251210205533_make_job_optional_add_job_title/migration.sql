-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "jobTitle" TEXT,
ALTER COLUMN "jobId" DROP NOT NULL;
