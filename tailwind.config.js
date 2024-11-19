const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(dropdown|select|menu|divider|popover|button|ripple|spinner|listbox|scroll-shadow).js"
  ],
	theme: {
		extend: {
			colors: {
				"hover-color": "#070a10",
				"color-text": "#aaa",
				box: "#0d1117",
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
		},
	},
  plugins: [nextui()],
}
