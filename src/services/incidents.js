import prisma from "@/lib/prisma"
import { formatedData } from "@/utils/formatedData"
import { errStatus } from "@/utils/status"

const todayDate = new Intl.DateTimeFormat("pl-PL", {
	month: "2-digit",
	year: "numeric",
	day: "2-digit",
}).format(new Date())

export const addIncident = async (site, code, status) => {
	try {
		let incidentId = await prisma.incidentsList.findMany({
			where: {
				AND: [
					{
						dateIncident: {
							date: todayDate,
						},
					},
					{
						url: site,
					},
				],
			},
			include: {
				dateIncident: true,
			},
		})

		if (incidentId.length > 0) {
			for (const item of incidentId) {
				if (item.errStatus === "rozwiązany") {
					continue
				}

				await prisma.incidentsList.update({
					where: { id: item.id },
					data: {
						errStatus: errStatus(item.errStatus || "chwilowy"),
						errStatusUpdate: formatedData(new Date()),
					},
				})
				return
			}
		}

		if (incidentId.length == 0 || incidentId[0].errStatus === "rozwiązany") {
			incidentId = await prisma.dateIncidents.findMany({
				where: { date: todayDate },
				select: { id: true },
			})
		}

		if (!incidentId) await prisma.dateIncidents.create({ data: { date: todayDate } })

		await prisma.incidentsList.create({
			data: {
				url: site,
				type: site.includes("api") ? "api" : "web",
				status: status,
				description: code,
				date: new Date(),
				errStatus: "chwilowy",
				errStatusUpdate: formatedData(new Date()),
				dateIncidentId: incidentId[0].id,
			},
		})
	} catch (err) {
		console.log(err)
		return new Response("Wystapil nieznany blad")
	}
}

export const changeStatusIncident = async site => {
	try {
		const checkStatusIncident = await prisma.incidentsList.findMany({
			where: {
				AND: [
					{
						dateIncident: { date: todayDate },
					},
					{
						url: site,
					},
				],
			},
			include: { dateIncident: true },
		})

		checkStatusIncident.map(async item => {
			if (item.errStatus === "rozwiązany") return

			await prisma.incidentsList.update({
				where: { id: item.id },
				data: { errStatus: "rozwiązany", errStatusUpdate: formatedData(new Date()) },
			})
		})
	} catch (err) {
		console.log(err)
		return new Response("Wystapil nieznany blad")
	}
}
