import prisma from "@/lib/prisma"

export async function GET(request) {
	try {
		const incidentsList = await prisma.dateIncidents.findMany({
			include: { incidentsList: true },
			orderBy: { dateSystem: "desc" },
			take: 5,
		})

		return new Response(JSON.stringify(incidentsList))
	} catch (err) {
		console.log(err)
	}
}
