import prisma from "@/lib/prisma"

export async function GET(request) {
	try {
		const deleteOld = new Date()
		deleteOld.setDate(deleteOld.getDate() - 2)

		await prisma.status.deleteMany({
			where: { updateAt: { lt: deleteOld } },
		})

		deleteOld.setDate(deleteOld.getDate() - 3)

		await prisma.dateIncidents.deleteMany({
			where: { dateSystem: { lt: deleteOld } },
		})

		return new Response("Usunieto wszystkie dane", { status: 200 })
	} catch (err) {
		console.log(err)
		return new Response("Wystapil nieznany blad", { status: 500 })
	}
}
