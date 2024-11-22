import prisma from "@/lib/prisma"

export async function GET(request) {
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
			return new Response("Data juz taka istnieje", { status: 200 })
		}

		await prisma.dateIncidents.create({
			data: { date: todayDate },
		})

		return new Response("Stworzno date dla nowego dnia", { status: 201 })
	} catch (err) {
		console.log(err)
	}
}
