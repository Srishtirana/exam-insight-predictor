import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
<<<<<<< HEAD
  base: "/exam-insight-predictor/", // ✅ GitHub Pages repo name
=======
  // ✅ IMPORTANT: Base path for GitHub Pages
  // Replace "exam-insight-predictor" with your repo name if different
  base: "/exam-insight-predictor/",
>>>>>>> 6522c29d8e296c7698ca89ccf29079ac3c4a38bf

  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
