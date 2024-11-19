import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({})

export default async function handler(req, res) {
	if (req.method != "GET") return

	try {
		const incidentsList = await prisma.dateIncidents.findMany({
			include: { incidentsList: true },
			orderBy: { dateSystem: "desc" },
			take: 5,
		})

		res.status(200).json(incidentsList)
	} catch (err) {
		console.log(err)
	}
}
