import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        dts({
            insertTypesEntry: true,
        }),
    ],
    server: {
        port: 4407,
    },
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "PlainUIVueTailwindTs",
            fileName: (format) => `index.${format === "es" ? "js" : format === "umd" ? "umd.cjs" : "cjs"}`,
            formats: ["es", "umd"],
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue",
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
