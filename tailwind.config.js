/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                takamul: {
                    dark: "#0a0a0a",      // Deep Black
                    red: "#dc2626",       // Industrial Red (from logo)
                    slate: "#1f2937",     // Dark Slate
                    white: "#f9fafb",     // Off-white
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
