/*
  Warnings:

  - You are about to drop the column `compaignId` on the `Click` table. All the data in the column will be lost.
  - Added the required column `campaignId` to the `Click` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Click" DROP CONSTRAINT "Click_compaignId_fkey";

-- AlterTable
ALTER TABLE "public"."Click" DROP COLUMN "compaignId",
ADD COLUMN     "campaignId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Click" ADD CONSTRAINT "Click_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
