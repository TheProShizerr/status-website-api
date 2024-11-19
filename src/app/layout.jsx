import localFont from "next/font/local"
import "./globals.css"
import "./globalicon.css"
import Head from "next/head"

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
})
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
})

export const metadata = {
	title: "Statusy systemów",
	description: "Zobacz statusy systemów shizeclone.eu oraz szablonydiscord.pl",
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<Head>
				<title>{metadata.title}</title>
				<meta name="description" content={metadata.description} />
				<link rel="icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" sizes="180x180" href="../../public/shizeclone.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/../../public/shizeclone.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="../../public/shizeclone.png" />
				<meta name="theme-color" content="#ffffff" />
			</Head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	)
}
