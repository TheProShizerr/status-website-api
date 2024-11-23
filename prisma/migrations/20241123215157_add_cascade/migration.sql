-- DropForeignKey
ALTER TABLE "IncidentsList" DROP CONSTRAINT "IncidentsList_dateIncidentId_fkey";

-- AddForeignKey
ALTER TABLE "IncidentsList" ADD CONSTRAINT "IncidentsList_dateIncidentId_fkey" FOREIGN KEY ("dateIncidentId") REFERENCES "DateIncidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
