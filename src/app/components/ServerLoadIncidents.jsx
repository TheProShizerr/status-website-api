export const revalidate = "no-store"
import prisma from "@/lib/prisma"

export default async function ServerLoadIncidents() {
	const data = await prisma.dateIncidents.findMany({
		include: { incidentsList: true },
		orderBy: { dateSystem: "desc" },
		take: 5,
	})

	return (
		<div className="mt-10">
			<h2 className="uppercase text-xs font-bold">Incydenty które miały miejsce</h2>
			{data &&
				data.map((incident, index) => (
					<div className="my-2" key={index}>
						<p className="text-lg font-bold mt-10">{incident.date}</p>
						<div className="w-full h-0.5 bg-[#12161d] mt-2"></div>
						<p className={`${incident.incidentsList.length === 0 ? "block" : "hidden"} mt-2 text-color-text`}>
							Nasz system nie odnotował incydentu dla tego dnia.
						</p>
						{incident.incidentsList.slice(0, 3).map(item => (
							<div key={item.id} className="max-md:my-3">
								<p className="mt-2 text-color-text text-base">
									<span className="font-bold">ERROR - </span>
									{item.description} ({item.status}), {item.url},
								</p>
								<p className="text-[0.80rem] mt-1">
									Data: {new Date(item.date).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })}
								</p>
							</div>
						))}
					</div>
				))}
		</div>
	)
}
