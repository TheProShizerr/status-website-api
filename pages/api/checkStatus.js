import { PrismaClient } from "@prisma/client"
import axios from "axios"
import { stat } from "fs"

const prisma = new PrismaClient({})

const website = [
	{
		url: "https://szablonydiscord.pl",
		method: "GET",
		headers: {},
		data: {},
	},
	{
		url: "https://shizeclone.eu",
		method: "GET",
		headers: {},
		data: {},
	},
	{
		url: "https://szablonydiscord.pl/api/v2/templates",
		method: "GET",
		headers: {
			"x-api-key": process.env.TEMPLATES_API,
		},
		data: {},
	},
	{
		url: "https://api.shizeclone.eu/fetchGuilds",
		method: "POST",
		headers: {
			"x-api-key": process.env.DISCORD_API_KEY,
		},
		data: {
			token: process.env.DISCORD_TOKEN,
		},
	},
	{
		url: "https://api.shizeclone.eu/fetchEmojis",
		method: "POST",
		headers: {
			"x-api-key": process.env.DISCORD_API_KEY,
		},
		data: {
			token: process.env.DISCORD_TOKEN,
			guildId: process.env.DISCORD_GUILDID,
		},
	},
	{
		url: "https://api.shizeclone.eu/fetchRolesEmojis",
		method: "POST",
		headers: {
			"x-api-key": process.env.DISCORD_API_KEY,
		},
		data: {
			token: process.env.DISCORD_TOKEN,
			guildId: process.env.DISCORD_GUILDID,
		},
	},
]

const data = {}

export default async function handler(req, res) {
	const addIncident = async (site, code, status) => {
		const todayDate = new Date()
			.toLocaleString("pl-PL", {
				timeZone: "Europe/Warsaw",
			})
			.split(",")[0]

		const incidentId = await prisma.dateIncidents.findMany({
			where: { date: todayDate },
		})

		if (!incidentId) return

		await prisma.incidentsList.create({
			data: {
				url: site,
				type: site.includes("api") ? "api" : "web",
				status: status,
				description: code,
				date: new Date(),
				dateIncidentId: incidentId[0].id,
			},
		})
	}

	for (const site of website) {
		try {
			const dateBefore = new Date()

			const checkStatus = await axios({
				method: site.method,
				url: site.url,
				headers: site.headers,
				data: site.data,
			})

			const dateAfter = new Date()

			const dateSum = dateAfter.getTime() - dateBefore.getTime()

			data.url = site.url
			data.type = site.url.includes("api") ? "api" : "web"
			data.status = checkStatus.status.toString()
			data.timeResponse = dateSum.toString()

			await prisma.status.create({ data })
		} catch (err) {
			data.url = site.url
			data.type = site.url.includes("api") ? "api" : "web"
			data.status = err.status.toString()

			await prisma.status.create({ data })

			addIncident(site.url, err.code, err.status.toString())
		}
	}

	res.status(200).json({ message: "Wszystkie strony zostały przeskanowane" })
}
