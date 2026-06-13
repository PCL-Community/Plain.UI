# @pcl-community/plain-ui-vue-tailwind-js

Plain UI - Vue 3 + TailwindCSS + JavaScript 组件库

## 安装

```bash
npm install @pcl-community/plain-ui-vue-tailwind-js
# 或
yarn add @pcl-community/plain-ui-vue-tailwind-js
# 或
pnpm add @pcl-community/plain-ui-vue-tailwind-js
```

## 使用

### 完整引入

```javascript
import { createApp } from 'vue'
import PlainUI from '@pcl-community/plain-ui-vue-tailwind-js'
import '@pcl-community/plain-ui-vue-tailwind-js/style.css'

const app = createApp(App)
app.use(PlainUI)
```

### 按需引入

```javascript
import { Button } from '@pcl-community/plain-ui-vue-tailwind-js'
import '@pcl-community/plain-ui-vue-tailwind-js/style.css'
```

## 技术栈

- Vue 3.4+
- TailwindCSS 4.0+
- JavaScript

## 许可证

MIT
