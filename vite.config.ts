import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

// Carga el archivo .env correspondiente al modo (ej. .env.environment, .env.production)
dotenv.config({ path: `.env.${process.env.MODE}` });
// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		proxy: {
		  '/api': {
			target: 'https://ugv0ydrd77.execute-api.us-east-1.amazonaws.com',
			changeOrigin: true,
			rewrite: (path) => path.replace(/^\/api/, '/web/advertising'),
			secure: false,
			headers: {
			  'Origin': 'http://localhost:5173'
			}
		  }
		}
	  },
});
