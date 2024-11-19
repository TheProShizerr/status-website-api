/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `DateIncidents` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `date` on the `DateIncidents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "DateIncidents" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DateIncidents_date_key" ON "DateIncidents"("date");
