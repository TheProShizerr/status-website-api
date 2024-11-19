-- DropIndex
DROP INDEX "DateIncidents_date_key";

-- AlterTable
ALTER TABLE "DateIncidents" ALTER COLUMN "date" SET DATA TYPE TEXT;
