/*
  Warnings:

  - You are about to drop the `Compaign` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Click" DROP CONSTRAINT "Click_compaignId_fkey";

-- DropTable
DROP TABLE "public"."Compaign";

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Click" ADD CONSTRAINT "Click_compaignId_fkey" FOREIGN KEY ("compaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
