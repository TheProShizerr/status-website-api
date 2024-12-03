import prisma from "@/lib/prisma"
import ClientIncidents from "./ClientIncidents"

export default async function ServerLoadIncidents() {
	const data = await prisma.dateIncidents.findMany({
		include: { incidentsList: true },
		orderBy: { dateSystem: "desc" },
		include: { incidentsList: { orderBy: { date: "desc" } } },
		take: 5,
	})

	return <ClientIncidents data={data} />
}
