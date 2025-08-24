/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Click` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Conversion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clickId]` on the table `Click` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clickId]` on the table `Conversion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Click" DROP COLUMN "createdAt",
DROP COLUMN "timestamp",
ADD COLUMN     "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Conversion" DROP COLUMN "timestamp",
ADD COLUMN     "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Click_clickId_key" ON "public"."Click"("clickId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversion_clickId_key" ON "public"."Conversion"("clickId");
