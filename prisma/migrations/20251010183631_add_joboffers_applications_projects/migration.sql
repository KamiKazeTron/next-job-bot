/*
  Warnings:

  - You are about to drop the column `projectId` on the `Application` table. All the data in the column will be lost.
  - Added the required column `jobOfferId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technologies` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_projectId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "projectId",
ADD COLUMN     "jobOfferId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "liveUrl" TEXT,
ADD COLUMN     "technologies" JSONB NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "JobOffer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "company" TEXT,
    "budget" DOUBLE PRECISION,
    "deadline" TIMESTAMP(3),
    "skillsRequired" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationProject" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ApplicationProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationProject_applicationId_projectId_key" ON "ApplicationProject"("applicationId", "projectId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobOfferId_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "JobOffer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationProject" ADD CONSTRAINT "ApplicationProject_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationProject" ADD CONSTRAINT "ApplicationProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
