import prisma from "@/lib/prisma"

export async function GET(request) {
	try {
		const todayDate = new Intl.DateTimeFormat("pl-PL", {
			month: "2-digit",
			year: "numeric",
			day: "2-digit",
		}).format(new Date())

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
		return new Response(JSON.stringify({ error: "Wystapil blad", errorDetails: err.message }))
	}
}
