/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `portfolios` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "imageUrl",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "number",
DROP COLUMN "portfolios",
DROP COLUMN "resumeUrl",
DROP COLUMN "updatedAt",
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "portfolio" TEXT,
ADD COLUMN     "resume" TEXT;
