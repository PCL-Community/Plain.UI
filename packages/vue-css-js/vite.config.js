import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 4404,
    },
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.js"),
            name: "PlainUIVueCssJs",
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
