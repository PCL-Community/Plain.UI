# @pcl-community/plain-ui-vue-css-ts

Plain UI - Vue 3 + CSS + TypeScript 组件库

## 安装

```bash
npm install @pcl-community/plain-ui-vue-css-ts
# 或
yarn add @pcl-community/plain-ui-vue-css-ts
# 或
pnpm add @pcl-community/plain-ui-vue-css-ts
```

## 使用

### 完整引入

```typescript
import { createApp } from 'vue'
import PlainUI from '@pcl-community/plain-ui-vue-css-ts'
import '@pcl-community/plain-ui-vue-css-ts/style.css'

const app = createApp(App)
app.use(PlainUI)
```

### 按需引入

```typescript
import { Button } from '@pcl-community/plain-ui-vue-css-ts'
import '@pcl-community/plain-ui-vue-css-ts/style.css'
```

## 技术栈

- Vue 3.4+
- CSS
- TypeScript 5.4+

## 许可证

MIT
