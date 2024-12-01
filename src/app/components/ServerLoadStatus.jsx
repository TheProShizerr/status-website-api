export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

import prisma from "@/lib/prisma"
import ClientStatus from "./ClientStatus"
import { website } from "@/utils/website"

export default async function ServerLoadStatus() {
	const result = {}

	const startOfDay = new Date()
	startOfDay.setUTCHours(0, 0, 0, 0)

	const endOfDay = new Date()
	endOfDay.setUTCHours(23, 59, 59, 999)

	const [allStatuses, todayStatuses] = await Promise.all([
		prisma.status.findMany({
			where: {
				url: { in: website },
			},
			orderBy: {
				updateAt: "desc",
			},
			take: 40 * website.length,
		}),
		prisma.status.findMany({
			where: {
				url: { in: website },
				updateAt: {
					gte: startOfDay,
					lte: endOfDay,
				},
			},
		}),
	])

	const groupedStatuses = website.reduce((acc, site) => {
		acc[site] = allStatuses.filter(status => status.url === site)
		return acc
	}, {})

	const groupedActive = website.reduce((acc, site) => {
		const filteredStatuses = todayStatuses.filter(el => el.url === site)

		acc[site] = {
			success: filteredStatuses.filter(el => el.status == 200).length,
			length: filteredStatuses.length,
		}
		return acc
	}, {})

	for (const site of website) {
		const readyGroup = groupedStatuses[site]
		const readyActive = groupedActive[site]

		const websiteActive = (readyActive.success / readyActive.length) * 100
		const type = site.includes("api") ? "api" : "web"

		result[site] = {
			url: site,
			active: websiteActive.toFixed(1),
			type: type,
			statusList: readyGroup.map(item => ({
				status: parseInt(item.status),
				updateAt: new Date(item.updateAt).toLocaleString("pl-PL", {
					month: "2-digit",
					year: "numeric",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					timeZone: "Europe/Warsaw",
				}),
				timeResponse: parseInt(item.timeResponse),
			})),
		}
	}

	const systemStatus = Object.values(result).some(el => el.statusList[0].status !== 200)

	return <ClientStatus result={result} systemStatus={systemStatus} />
}
