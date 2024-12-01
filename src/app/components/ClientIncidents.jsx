"use client"

import { formatedData } from "@/utils/formatedData"
import { useState } from "react"

export default function ClientIncidents({ data }) {
	const [visible, setVisible] = useState({})

	const changeVisible = date => {
		setVisible(prev => ({
			...prev,
			[date]: !prev[date],
		}))
	}

	return (
		<div className="mt-10">
			<h2 className="uppercase text-xs font-bold">Incydenty które miały miejsce</h2>
			{data &&
				data.map((incident, index) => (
					<div className="my-2" key={index}>
						<div className="flex items-center justify-between mt-7 ">
							<p className="text-lg font-bold">{incident.date}</p>
							<button
								className={`mt-2 text-sm ${incident.incidentsList.length > 3 ? "block" : "hidden"}`}
								onClick={() => changeVisible(incident.date)}>
								{visible[incident.date] ? "Ukryj" : `Pokaz wszystko (${incident.incidentsList.length - 3})`}
							</button>
						</div>
						<div className="w-full h-0.5 bg-[#12161d] mt-2"></div>
						<p className={`${incident.incidentsList.length === 0 ? "block" : "hidden"} mt-2 text-color-text`}>
							Nasz system nie odnotował incydentu dla tego dnia.
						</p>
						{incident.incidentsList
							.slice(0, visible[incident.date] ? incident.incidentsList.length : 3)
							.reverse()
							.map(item => (
								<div key={item.id} className="max-md:my-3">
									<p className="mt-2 text-color-text text-base">
										<span className="font-bold">ERROR - </span>
										{item.description} ({item.status}), {item.url},
									</p>
									<p className="text-[0.80rem] mt-1">Data: {formatedData(item.date)}</p>
								</div>
							))}
					</div>
				))}
		</div>
	)
}
