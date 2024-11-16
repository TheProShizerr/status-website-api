export default function Loader({ status }) {
	console.log(status)
	return (
		<>
			<div
				className={`${
					status ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
				} fixed top-0 left-0 w-full bg-[#161616] flex space-x-2 justify-center items-center h-screen transition-all duration-300 ease-in-out`}>
				<span className="sr-only">Loading...</span>
				<div className="h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
				<div className="h-8 w-8 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
				<div className="h-8 w-8 bg-white rounded-full animate-bounce"></div>
			</div>
		</>
	)
}
