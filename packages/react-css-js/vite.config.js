import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import libInjectCss from "vite-plugin-lib-inject-style";
import { resolve } from "path";

export default defineConfig({
    plugins: [react(), libInjectCss()],
    server: {
        port: 4400,
    },
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.js"),
            name: "PlainUIReactCssJs",
            fileName: (format) => `index.${format === "es" ? "js" : format === "umd" ? "umd.cjs" : "cjs"}`,
            formats: ["es", "umd"],
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === "style.css") return "style.css";
                    return assetInfo.name;
                },
            },
        },
        cssCodeSplit: false,
    },
});
