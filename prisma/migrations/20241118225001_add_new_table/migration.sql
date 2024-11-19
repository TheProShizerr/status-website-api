-- CreateTable
CREATE TABLE "DateIncidents" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "DateIncidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentsList" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateIncidentId" INTEGER NOT NULL,

    CONSTRAINT "IncidentsList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IncidentsList" ADD CONSTRAINT "IncidentsList_dateIncidentId_fkey" FOREIGN KEY ("dateIncidentId") REFERENCES "DateIncidents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
