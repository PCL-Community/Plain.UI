import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import libInjectCss from "vite-plugin-lib-inject-style";
import { resolve } from "path";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        dts({
            insertTypesEntry: true,
        }),
        libInjectCss(),
    ],
    server: {
        port: 4403,
    },
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "PlainUIReactTailwindTs",
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
