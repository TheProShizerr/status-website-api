/*
  Warnings:

  - Added the required column `status` to the `IncidentsList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IncidentsList" ADD COLUMN     "status" TEXT NOT NULL;
