import "./globals.css"
import "./globalicon.css"
import Head from "next/head"

export const metadata = {
	title: "Statusy systemów",
	description: "Zobacz statusy systemów shizeclone.eu oraz szablonydiscord.pl",
}

export default function RootLayout({ children }) {
	return (
		<html lang="pl">
			<Head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
				<link rel="icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" sizes="180x180" href="../../public/shizeclone.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/../../public/shizeclone.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="../../public/shizeclone.png" />
				<meta name="theme-color" content="#ffffff" />
			</Head>
			<body className={`antialiased`}>{children}</body>
		</html>
	)
}
