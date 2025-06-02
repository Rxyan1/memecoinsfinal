/*
  Warnings:

  - You are about to alter the column `zth` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pspCoins" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "zth" SET DEFAULT 0,
ALTER COLUMN "zth" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
