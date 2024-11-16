"use client"

import { useEffect, useState } from "react"
import { Tooltip } from "@nextui-org/react"
import Footer from "../components/Footer"

const StatusBox = () => {
	const [data, setData] = useState(null)
	const [now, setNow] = useState(new Date())
	const [windowSize, setWindowSize] = useState(undefined)

	const loadData = async () => {
		try {
			const data = await fetch("/api/statusData")
			const dataRes = await data.json()

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

		if (differenceInMinutes == 0) {
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
		if (windowSize <= 768) return 20
	}

	useEffect(() => {
		lengthVisible()
	}, [windowSize])

	return (
		<>
			<h2 className="w-full max-lg:p-1 text-left text-xl mb-4">Strony internetowe</h2>
			<div className="flex flex-col gap-5 bg-box p-2 rounded-lg w-full  mx-auto">
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
											<Tooltip content="Aktywność strony">
												<p className="bg-green-500 px-3 rounded-lg text-black text-sm">{item.active}%</p>
											</Tooltip>
											<a className="text-color-text underline" href={item.url}>
												{item.url}
											</a>
										</div>
										<div className="flex items-center gap-2">
											<p className="bg-green-700 px-3 text-[0.70rem] w-fit rounded-lg mt-1">
												Certyfikat wygasa za 50 dni
											</p>
											<p className="bg-purple-600 px-3 text-[0.70rem] w-fit rounded-lg mt-1">cdn</p>
										</div>
									</div>
									<div className="flex flex-col overflow-x-auto">
										<div className="flex gap-1 flex-wrap">
											{Object.values(item.statusList)
												.splice(0, lengthVisible())
												.map((list, index) => (
													<Tooltip content={list.updateAt} key={index}>
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

			<h2 className="w-full max-lg:p-1 text-left text-xl mb-4 mt-10">API status</h2>
			<div className="flex flex-col gap-5  bg-box rounded-lg w-full max-w-screen-xl p-2">
				{data &&
					Object.values(data)
						.filter(item => item.type === "api")
						.map((item, index) => (
							<div
								className="flex flex-col items-center w-full hover:bg-hover-color transition-colors px-4 py-2.5 rounded-lg"
								key={index}>
								<div className="flex max-sm:flex-col gap-5  w-full justify-between items-center mb-1 max-sm:gap-0">
									<div className="max-lg:pb-5">
										<div className="flex gap-2 items-center w-full max-sm:justify-center">
											<Tooltip content="Aktywność API">
												<p className="bg-green-500 px-3 rounded-lg text-black text-sm">{item.active}%</p>
											</Tooltip>
											<a className="text-color-text underline max-sm:truncate max-sm:w-[60%]" href={item.url}>
												{item.url}
											</a>
										</div>
										<div className="flex items-center gap-2 max-sm:justify-center">
											<p className="bg-green-700 px-3 text-[0.70rem] w-fit rounded-lg mt-1">https</p>
											<p className="bg-green-700 px-3 text-[0.70rem] w-fit rounded-lg mt-1">api</p>
											<p className="bg-purple-600 px-3 text-[0.70rem] w-fit rounded-lg mt-1">cdn</p>
										</div>
									</div>
									<div className="flex flex-col overflow-hidden">
										<div className="flex gap-1 overflow-x-auto max-w-full">
											{Object.values(item.statusList)
												.splice(0, lengthVisible())
												.map((list, index) => (
													<Tooltip content={list.updateAt} key={index}>
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
		</>
	)
}

const Header = () => {
	return (
		<>
			{/* <div className="flex items-center gap-3 bg-box p-6 rounded-lg my-10 max-w-screen-xl">
				<span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
				<p className="text-xl">Wszystkie nasze systemy działają poprawnie</p>
			</div> */}
		</>
	)
}

export default function Home() {
	return (
		<>
			<div className="max-w-screen-xl mx-auto p-2">
				<Header />
				<StatusBox />
				<Footer />
			</div>
		</>
	)
}
