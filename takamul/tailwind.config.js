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
                    dark: "#0a0a0a",
                    blue: "#3b82f6",
                    slate: "#64748b",
                    contrast: "#ffffff",
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
