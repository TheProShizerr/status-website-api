"use client"

import { useEffect, useState } from "react"
import { Tooltip } from "@nextui-org/react"
import Footer from "../components/Footer"
import Loader from "../components/Loader"

const Header = ({ status }) => {
	return (
		<>
			<div className="flex items-center max-sm:items-start gap-3 bg-box p-6 rounded-lg my-10 w-full">
				<span className={`material-symbols-outlined text-4xl ${status ? "text-red-500" : "text-green-500"}`}>
					{status ? "schedule" : "check_circle"}
				</span>
				<p className={`text-xl max-sm:text-lg ${status ? "text-red-500" : "text-green-500"}`}>
					{status
						? "Wystepuja chwilowe problemy w dzialaniu naszych systemow"
						: "Wszystkie nasze systemy działają poprawnie"}
				</p>
			</div>
		</>
	)
}

const Incidents = () => {
	const [data, setData] = useState(null)

	const loadData = async () => {
		try {
			const data = await fetch("/api/checkIncidents")
			const response = await data.json()

			console.log(response)
			setData(response)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		loadData()
	}, [])

	return (
		<>
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
		</>
	)
}

export default function Home() {
	const [data, setData] = useState(null)
	const [now, setNow] = useState(new Date())
	const [windowSize, setWindowSize] = useState(undefined)
	const [status, setStatus] = useState(false)
	const [loader, setLoader] = useState(true)

	const loadData = async () => {
		try {
			const data = await fetch("/api/statusData")
			const dataRes = await data.json()

			const hasNon200Status = Object.values(dataRes).some(el => el.statusList[0].status !== 200)

			if (hasNon200Status) {
				setStatus(true)
			}

			setData(dataRes)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		function handleResize() {
			setWindowSize(window.innerWidth)
		}

		window.addEventListener("resize", handleResize)

		handleResize()

		return () => window.removeEventListener("resize", handleResize)
	}, [])

	useEffect(() => {
		loadData()
	}, [])

	useEffect(() => {
		if (data) setLoader(false)
	}, [data])

	useEffect(() => {
		const interval = setInterval(() => {
			setNow(new Date())
			loadData()
		}, 60000)
		return () => clearInterval(interval)
	}, [])

	const getTimeDifference = lastScanTime => {
		const [datePart, timePart] = lastScanTime.split(", ")
		const [day, month, year] = datePart.split(".")
		const isoFormattedDate = `${year}-${month}-${day}T${timePart}`

		const lastScanDate = new Date(isoFormattedDate)

		const differenceInMinutes = Math.floor((now - lastScanDate) / (1000 * 60))

		if (differenceInMinutes == 0 || differenceInMinutes < 0) {
			return `Teraz`
		} else if (differenceInMinutes < 60) {
			return `${differenceInMinutes} min temu`
		} else {
			const hours = Math.floor(differenceInMinutes / 60)
			return `${hours}h temu`
		}
	}

	const lengthVisible = () => {
		if (windowSize >= 1024) return 40
		if (windowSize >= 768) return 30
		if (windowSize <= 320) return 20
		if (windowSize <= 768) return 25
	}

	useEffect(() => {
		lengthVisible()
	}, [windowSize])

	return (
		<>
			<Loader status={loader} />
			<div className={`max-w-screen-xl mx-auto w-full py-4 p-2 ${loader ? "hidden" : "block"}`}>
				<Header status={status} />
				<h2 className="w-full text-left text-xl mb-4">Strony internetowe</h2>
				<div className="flex flex-col gap-5 bg-box p-2 rounded-lg w-full ">
					{data &&
						Object.values(data)
							.filter(item => item.type === "web")
							.map((item, index) => (
								<div
									className="flex flex-col items-center w-full hover:bg-hover-color transition-colors px-4 py-2.5 rounded-lg"
									key={index}>
									<div className="flex gap-5 w-full justify-between items-center mb-1 max-sm:flex-col max-sm:gap-0">
										<div className="max-lg:pb-5">
											<div className="flex gap-2 items-center">
												<Tooltip className="bg-hover-color" content="Aktywność ostatnie 24h">
													<p className="bg-green-500 px-3 rounded-lg text-black text-sm">{item.active}%</p>
												</Tooltip>
												<a className="text-color-text underline" href={item.url}>
													{item.url}
												</a>
											</div>
											<div className="flex items-center gap-2">
												<p className="bg-green-700 px-3 text-[0.70rem] w-fit rounded-lg mt-1">
													właściciel TheProShizer
												</p>
												<p className="bg-purple-600 px-3 text-[0.70rem] w-fit rounded-lg mt-1">cdn</p>
											</div>
										</div>
										<div className="flex flex-col overflow-x-auto">
											<div className="flex gap-1 flex-wrap">
												{Object.values(item.statusList)
													.splice(0, lengthVisible())
													.map((list, index) => (
														<Tooltip
															className="bg-hover-color"
															content={
																<div className="py-2  p-1 px-2 rounded-t-lg">
																	<div className="text-base font-bold">{list.updateAt}</div>
																	<div className="text-sm">
																		Czas odpowiedzi: {list.timeResponse && list.timeResponse}ms
																	</div>
																</div>
															}
															delay={500}
															key={index}>
															<div
																className={`w-2 h-6 rounded-lg ${list.status === 200 ? "bg-green-500" : "bg-red-500"}`}
																key={index}></div>
														</Tooltip>
													))}
											</div>
											<div className="flex justify-between mt-1">
												<p className="text-color-text text-sm">{getTimeDifference(item.statusList[0].updateAt)}</p>
												<p className="text-color-text text-sm">{getTimeDifference(item.statusList[39].updateAt)}</p>
											</div>
										</div>
									</div>
								</div>
							))}
				</div>
				<h2 className="w-full text-left text-xl mb-4 mt-10">API status</h2>
				<div className="flex flex-col gap-5 bg-box p-2 rounded-lg w-full overflow-hidden ">
					{data &&
						Object.values(data)
							.filter(item => item.type === "api")
							.map((item, index) => (
								<div
									className="flex flex-col items-center w-full hover:bg-hover-color transition-colors px-4 py-2.5 rounded-lg"
									key={index}>
									<div className="flex gap-5 w-full justify-between items-center mb-1 max-sm:flex-col max-sm:gap-0">
										<div className="max-lg:pb-5">
											<div className="flex gap-2 items-center w-full max-sm:justify-center">
												<Tooltip className="bg-hover-color" content="Aktywność ostatnie 24h">
													<p className="bg-green-500 px-3 rounded-lg text-black text-sm">{item.active}%</p>
												</Tooltip>
												<a className="text-color-text underline max-sm:truncate max-sm:w-[60%]" href={item.url}>
													{item.url.split("https://")[1]}
												</a>
											</div>
											<div className="flex items-center gap-2 max-sm:justify-center">
												<p className="bg-green-700 px-3 text-[0.70rem] w-fit rounded-lg mt-1">https</p>
												<p className="bg-green-700 px-3 text-[0.70rem] w-fit rounded-lg mt-1">api</p>
												<p className="bg-purple-600 px-3 text-[0.70rem] w-fit rounded-lg mt-1">cdn</p>
											</div>
										</div>
										<div className="flex flex-col overflow-x-auto">
											<div className="flex gap-1 flex-wrap">
												{Object.values(item.statusList)
													.splice(0, lengthVisible())
													.map((list, index) => (
														<Tooltip
															className="bg-hover-color"
															content={
																<div className="py-2  p-1 px-2 rounded-t-lg">
																	<div className="text-base font-bold">{list.updateAt}</div>
																	<div className="text-sm">
																		Czas odpowiedzi: {list.timeResponse && list.timeResponse}ms
																	</div>
																</div>
															}
															delay={500}
															key={index}>
															<div
																className={`w-2 h-6 rounded-lg ${list.status === 200 ? "bg-green-500" : "bg-red-500"}`}
																key={index}></div>
														</Tooltip>
													))}
											</div>
											<div className="flex justify-between mt-1">
												<p className="text-color-text text-sm">{getTimeDifference(item.statusList[0].updateAt)}</p>
												<p className="text-color-text text-sm">{getTimeDifference(item.statusList[39].updateAt)}</p>
											</div>
										</div>
									</div>
								</div>
							))}
				</div>
				<Incidents />
				<Footer />
			</div>
		</>
	)
}
