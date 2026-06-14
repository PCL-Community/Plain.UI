import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync } from "fs";

// 自定义插件：复制主题 CSS 到 dist 目录
const copyThemeCss = () => ({
    name: "copy-theme-css",
    closeBundle() {
        copyFileSync(
            resolve(__dirname, "src/styles/theme.css"),
            resolve(__dirname, "dist/theme.css")
        );
    },
});

export default defineConfig({
    plugins: [react(), copyThemeCss()],
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
            },
        },
    },
});
