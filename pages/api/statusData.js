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

	for (const site of website) {
		const read = await prisma.status.findMany({
			where: {
				url: site,
			},
			orderBy: {
				updateAt: "desc",
			},
			take: 40,
		})

		let succes = 0
		let notSucces = 0

		read.forEach(item => {
			const status = parseInt(item.status)
			if (status == 200) {
				succes++
			} else {
				notSucces++
			}
		})

		const websiteActive = (succes / 40) * 100

		const type = site.includes("api") ? "api" : "web"

		result[site] = {
			url: site,
			active: websiteActive,
			type: type,
			statusList: read.map(item => ({
				status: parseInt(item.status),
				updateAt: new Date(item.updateAt).toLocaleString("pl-PL", {
					timeZone: "Europe/Warsaw",
				}),
			})),
		}
	}
	res.json(result)
}
