# On-Demand ISR · EdgeOne Makers

[English](./README.md) | **简体中文**

> 基于 Next.js App Router 的**按需增量静态再生（On-Demand ISR）** 模板，部署于 **EdgeOne Makers**。

页面被静态缓存，每次访问返回同一份「生成时间」；只有调用重新验证接口后，页面才会被重新生成、时间才更新。

## 目录

- [特性](#特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [工作原理](#工作原理)
- [API](#api)
- [验证 ISR](#验证-isr)
- [部署](#部署)
- [环境变量](#环境变量)
- [项目结构](#项目结构)
- [许可证](#许可证)

## 特性

- ⚡️ **按需 ISR** —— 通过 `revalidatePath` / `revalidateTag` 精准刷新页面缓存
- 🔌 **重新验证接口** —— `GET`（浏览器可直接触发）与 `POST` 两种方式，支持可选密钥鉴权
- 🧪 **可视化演示** —— 首页展示「生成时间」，配合一键触发按钮，直观验证 ISR 是否生效

## 技术栈

- [Next.js 15](https://nextjs.org/)（App Router）
- [React 19](https://react.dev/)
- TypeScript
- [EdgeOne Makers](https://edgeone.ai/)（部署平台）

## 快速开始

### 环境要求

- Node.js ≥ 18
- npm（或 pnpm / yarn）

### 安装与开发

```bash
npm install
npm run dev        # http://localhost:3000
```

> ⚠️ 开发模式（`next dev`）**不启用缓存**，每次刷新时间都会变，看不到 ISR 效果。要验证 ISR，请使用生产构建（见下）。

### 生产构建

```bash
npm run build
npm start
```

## 工作原理

1. 首页 `app/page.tsx` 使用 `export const revalidate = 31536000`（大数值），是 **ISR 页面**（由 SSR 函数渲染），因此可被 `revalidatePath` 按需重新生成，注意不要用 `force-static`。
2. 重新验证接口 `app/api/revalidate/route.ts` 调用 `revalidatePath` / `revalidateTag`。

## API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/revalidate?path=/` | 按路径重新验证（浏览器可直接访问触发） |
| `GET` | `/api/revalidate?tag=<tag>` | 按 tag 重新验证 |
| `POST` | `/api/revalidate` | Body：`{ "paths": ["/"], "tags": [] }` |

鉴权为**可选**：设置了 `REVALIDATE_SECRET` 时，请求需带 `x-revalidate-secret` 头（`GET` 亦可用 `?secret=`）；未设置则不校验。首页按钮从 `NEXT_PUBLIC_REVALIDATE_SECRET` 读取该密钥。

## 验证 ISR

```bash
npm run build && npm start

# 1) 连刷两次，时间戳相同（命中缓存）
curl -s localhost:3000/ | grep -oE '[0-9T:.-]{20,}Z'
curl -s localhost:3000/ | grep -oE '[0-9T:.-]{20,}Z'

# 2) 触发重新验证
curl -s "localhost:3000/api/revalidate?path=/"

# 3) 再刷，时间戳变了 = 生效
curl -s localhost:3000/ | grep -oE '[0-9T:.-]{20,}Z'
```

> 在 EdgeOne 上验证时请用 **curl**（浏览器软刷新会命中 RSC / 浏览器缓存，可能显示旧值）；CDN purge 是异步的，第一次可能仍是旧值，多刷一次即可。分布式 CDN 下，不同边缘节点可能各自缓存了自己再生的副本，因此时间戳可能在几个值间跳动，属正常现象。

## 部署

```bash
edgeone makers build
edgeone makers deploy
```

如需鉴权，在 EdgeOne 控制台配置环境变量 `REVALIDATE_SECRET`（以及供首页按钮使用的 `NEXT_PUBLIC_REVALIDATE_SECRET`，两者取值需一致）。

## 环境变量

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `REVALIDATE_SECRET` | 否 | 重新验证接口的密钥；设置后接口才校验 |
| `NEXT_PUBLIC_REVALIDATE_SECRET` | 否 | 首页按钮调用接口时携带的密钥，需与上者一致 |

## 项目结构

```
app/
  page.tsx                # 首页（ISR，展示生成时间）
  revalidate-button.tsx   # 触发重新验证的按钮（客户端组件）
  api/revalidate/route.ts # 重新验证接口（GET / POST）
  layout.tsx              # 根布局
  not-found.tsx           # 404 页面
  page.module.css         # 首页样式
styles/
  globals.css             # 全局主题
next.config.ts
```

## 许可证

[MIT](./LICENSE.md)
