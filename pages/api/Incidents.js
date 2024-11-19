import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({})

export default async function handler(req, res) {
	if (req.method != "GET") return

	try {
		const todayDate = new Date()
			.toLocaleString("pl-PL", {
				timeZone: "Europe/Warsaw",
			})
			.split(",")[0]

		const search = await prisma.dateIncidents.findFirst({
			where: { date: todayDate },
		})

		if (search) {
			res.status(200).json({ message: "Data juz taka isntieje" })
			return
		}

		await prisma.dateIncidents.create({
			data: { date: todayDate },
		})

		res.status(200).json({ message: "Stworzno date dla nowego dnia" })
	} catch (err) {
		console.log(err)
	}
}
