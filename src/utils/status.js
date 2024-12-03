export function errStatus(currentStatus) {
	if (!currentStatus || typeof currentStatus !== "string") {
		console.error("Invalid status:", currentStatus)
		return "chwilowy"
	}
	switch (currentStatus) {
		case "chwilowy":
			return "tymczasowy"
		case "tymczasowy":
			return "potwierdzony"
		case "potwierdzony":
			return "potwierdzony"
		default:
			return "chwilowy"
	}
}
