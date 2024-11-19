import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({})

const website = [
	"https://szablonydiscord.pl",
	"https://shizeclone.eu",
	"https://szablonydiscord.pl/api/v2/templates",
	"https://api.shizeclone.eu/fetchGuilds",
	"https://api.shizeclone.eu/fetchEmojis",
	"https://api.shizeclone.eu/fetchRolesEmojis",
]

export default async function handler(req, res) {
	const result = {}
	const startOfDay = new Date()
	startOfDay.setUTCHours(0, 0, 0, 0)

	const endOfDay = new Date()
	endOfDay.setUTCHours(23, 59, 59, 999)

	for (const site of website) {
		let succes = 0
		let notSucces = 0

		const read = await prisma.status.findMany({
			where: {
				url: site,
			},
			orderBy: {
				updateAt: "desc",
			},
			take: 40,
		})

		const todayData = await prisma.status.findMany({
			where: {
				updateAt: {
					gte: startOfDay,
					lte: endOfDay,
				},
			},
		})

		todayData.forEach(item => {
			const status = parseInt(item.status)
			if (status == 200) {
				succes++
			} else {
				notSucces++
			}
		})

		const websiteActive = (succes / todayData.length) * 100
		const type = site.includes("api") ? "api" : "web"

		result[site] = {
			url: site,
			active: Math.round(websiteActive),
			type: type,
			statusList: read.map(item => ({
				status: parseInt(item.status),
				updateAt: new Date(item.updateAt).toLocaleString("pl-PL", {
					timeZone: "Europe/Warsaw",
				}),
				timeResponse: parseInt(item.timeResponse),
			})),
		}
	}
	res.json(result)
}
