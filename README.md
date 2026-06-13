# Plain UI

支持多种技术栈组合的 UI 组件库 Monorepo。

## 技术栈组合

| 框架 | 样式方案 | 语言 | 包名 | 开发命令 |
|------|----------|------|------|----------|
| Vue 3 | CSS | TypeScript | `@pcl-community/plain-ui-vue-css-ts` | `pnpm dev:vue-css-ts` |
| Vue 3 | TailwindCSS | TypeScript | `@pcl-community/plain-ui-vue-tailwind-ts` | `pnpm dev:vue-tailwind-ts` |
| Vue 3 | CSS | JavaScript | `@pcl-community/plain-ui-vue-css-js` | `pnpm dev:vue-css-js` |
| Vue 3 | TailwindCSS | JavaScript | `@pcl-community/plain-ui-vue-tailwind-js` | `pnpm dev:vue-tailwind-js` |
| React 18 | CSS | TypeScript | `@pcl-community/plain-ui-react-css-ts` | `pnpm dev:react-css-ts` |
| React 18 | TailwindCSS | TypeScript | `@pcl-community/plain-ui-react-tailwind-ts` | `pnpm dev:react-tailwind-ts` |
| React 18 | CSS | JavaScript | `@pcl-community/plain-ui-react-css-js` | `pnpm dev:react-css-js` |
| React 18 | TailwindCSS | JavaScript | `@pcl-community/plain-ui-react-tailwind-js` | `pnpm dev:react-tailwind-js` |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动特定组件库开发
pnpm dev:vue-tailwind-ts

# 构建所有组件库
pnpm build:all
```

## 目录结构

```
.
├── packages/
│   ├── vue-css-ts/          # Vue + CSS + TypeScript
│   ├── vue-tailwind-ts/     # Vue + TailwindCSS + TypeScript
│   ├── vue-css-js/          # Vue + CSS + JavaScript
│   ├── vue-tailwind-js/     # Vue + TailwindCSS + JavaScript
│   ├── react-css-ts/        # React + CSS + TypeScript
│   ├── react-tailwind-ts/   # React + TailwindCSS + TypeScript
│   ├── react-css-js/        # React + CSS + JavaScript
│   └── react-tailwind-js/   # React + TailwindCSS + JavaScript
├── package.json
├── pnpm-workspace.yaml
└── README.md
```
