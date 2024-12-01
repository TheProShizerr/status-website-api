export const formatedData = date => {
	return new Date(date).toLocaleString("pl-PL", {
		month: "2-digit",
		year: "numeric",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZone: "Europe/Warsaw",
	})
}
