/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#080b20",
        panel: "#111633",
        panel2: "#171d42",
        cyan: "#08d9ff",
        purple: "#a855f7",
        danger: "#ff4d67",
        success: "#22c55e",
        warning: "#f59e0b"
      },
      boxShadow: {
        glow: "0 0 35px rgba(8,217,255,.14)"
      }
    }
  },
  plugins: []
};