/*
  Warnings:

  - You are about to drop the column `githubUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `liveUrl` on the `Project` table. All the data in the column will be lost.
  - Made the column `education` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `experience` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "githubUrl",
DROP COLUMN "image",
DROP COLUMN "liveUrl";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "education" SET NOT NULL,
ALTER COLUMN "experience" SET NOT NULL;
