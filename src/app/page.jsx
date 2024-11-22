import Footer from "./components/Footer"
import ServerLoadIncidents from "./components/ServerLoadIncidents"
import ServerLoadStatus from "./components/ServerLoadStatus"

export default function Home() {
	return (
		<>
			<div className="max-w-screen-xl mx-auto w-full py-4 p-2">
				<ServerLoadStatus />
				<ServerLoadIncidents />
				<Footer />
			</div>
		</>
	)
}
