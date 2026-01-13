# AGENTS.md - Vibe工坊开发指南

## 项目概述

基于 Next.js 14 (App Router) + Tailwind CSS 4 构建的简约黑白风格个人博客。采用静态生成(SSG)、TypeScript 严格模式，支持深色/浅色主题切换。

## 构建与开发命令

```bash
# 开发环境（带 Turbopack）
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

**注意**: 本项目没有配置测试框架，无需运行测试命令。

## TypeScript 配置

- **严格模式**: 启用 (`strict: true`)
- **目标**: ES2017
- **模块解析**: bundler 模式
- **路径别名**:
  - `@/*` → 项目根目录
  - `@lib/*` → `./lib/*`
  - `@components/*` → `./components/*`
  - `@app/*` → `./app/*`
  - `@content/*` → `./content/*`

**务必**:
- 保持类型安全，禁止使用 `as any`、`@ts-ignore`
- 明确定义所有接口类型（参考 `lib/posts.ts` 中的 `PostMeta`、`Post`）
- 使用 `import type` 仅导入类型

## 导入规范

**优先级**:
1. 使用路径别名（如 `@/lib/utils`）
2. 相对路径（用于兄弟文件）

**导入顺序**:
```typescript
// 1. Node.js 内置模块
import fs from 'fs'
import path from 'path'

// 2. 第三方依赖
import matter from 'gray-matter'
import { format } from 'date-fns'

// 3. 类型导入
import type { Metadata } from 'next'

// 4. 内部模块（使用别名）
import { getSiteConfig } from '@/lib/utils'

// 5. 组件
import ThemeToggle from '@/components/ThemeToggle'
```

**禁止**:
- 路径使用 `../../` 嵌套超过2层（使用别名代替）
- 混合绝对/相对路径导入同一模块

## 命名约定

- **组件**: PascalCase (`ThemeToggle.tsx`, `HomePage()`)
- **函数**: camelCase (`getAllPosts()`, `generateSlug()`)
- **接口/类型**: PascalCase (`PostMeta`, `Post`)
- **常量**: UPPER_SNAKE_CASE（如需要）
- **文件名**: PascalCase (组件), camelCase (工具函数)

## 组件开发规范

### 服务端组件（默认）
```typescript
// 不使用 'use client'，默认为服务端组件
export default async function HomePage() {
  const posts = getAllPosts()
  return <div>{/* JSX */}</div>
}
```

### 客户端组件
```typescript
'use client'  // 必须在第一行

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  // ...
}
```

**关键规则**:
- 默认使用服务端组件（性能更优）
- 仅在需要交互（事件处理、状态）时使用客户端组件
- 避免在服务端组件中引入 `useState`、`useEffect` 等hooks

## Tailwind CSS 样式规范

### 主题系统
使用 CSS 变量支持主题切换（定义在 `app/globals.css`）:
```css
:root {
  --background: #ffffff;
  --foreground: #000000;
  --muted: #f5f5f5;
  --muted-foreground: #666666;
  --border: #e5e5e5;
}
.dark {
  --background: #000000;
  --foreground: #ffffff;
  --muted: #111111;
  --muted-foreground: #999999;
  --border: #333333;
}
```

**使用方式**:
```tsx
<div className="bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)]">
```

### 自定义工具类
- `.container-narrow` - 65ch 最大宽度
- `.container-wide` - 80rem 最大宽度
- `.btn`, `.btn-primary`, `.btn-outline` - 按钮样式
- `.card`, `.card-hover` - 卡片样式
- `.tag` - 标签样式
- `.markdown-content` - Markdown 内容样式

**务必**:
- 优先使用 Tailwind 原子类
- 使用 CSS 变量保持主题一致性
- 避免硬编码颜色值（使用 `var(--foreground)` 等）

## 错误处理

- 使用 Next.js 错误边界（`app/error.tsx`）处理组件错误
- 文件不存在时返回 `null`（参考 `lib/posts.ts` 的 `getPostBySlug()`）
- 简单的错误处理即可，无需过度工程化
- 避免使用 `console.error` 生产环境（仅开发调试）

## 文件组织

```
app/
├── layout.tsx          # 根布局（必须）
├── globals.css         # 全局样式
├── page.tsx            # 首页
├── loading.tsx         # 加载状态
├── error.tsx           # 错误边界
├── not-found.tsx       # 404 页面
└── [动态路由]/         # 动态页面（如 post/[slug]/）

lib/
├── posts.ts            # 文章处理系统（核心）
└── utils.ts            # 通用工具函数

components/
└── ThemeToggle.tsx     # React 组件

content/posts/          # Markdown 文章文件
```

**关键规则**:
- 文章使用 Markdown + Frontmatter（参考 `README.md`）
- 工具函数放在 `lib/` 目录
- 可复用组件放在 `components/` 目录
- 页面组件放在 `app/` 目录对应路由下

## Markdown 文章规范

**文件名格式**: `YYYY-MM-DD-文章标题.md`

**Frontmatter 示例**:
```markdown
---
title: 文章标题
date: 2024-01-01
tags: [STM32, 嵌入式]
---
```

**自动分类规则**（定义在 `lib/posts.ts`）:
- 文件名包含 `蓝桥杯` → `竞赛经验`
- 文件名包含 `STM32` 或 `嵌入式` → `嵌入式开发`
- 其他 → `技术笔记`

## Git 提交规范

（参考 `README.md`，本项目未强制，但建议遵循）:
- 使用清晰的提交信息
- 提交前运行 `npm run lint`
- 确保构建通过 `npm run build`

## 开发工作流

1. 创建/编辑 Markdown 文章到 `content/posts/`
2. 运行 `npm run dev` 本地预览
3. 修改代码时保持类型安全
4. 部署到 Vercel 时自动触发构建

## 禁止事项

- ❌ 禁止使用 `as any` 绕过类型检查
- ❌ 禁止在服务端组件中使用 `useState`、`useEffect`
- ❌ 禁止硬编码颜色（必须使用 CSS 变量）
- ❌ 禁止提交 `.next/`、`node_modules/` 等临时文件
- ❌ 禁止在 `app/layout.tsx` 之外使用 `html`、`body` 标签

## Vercel 部署

- 环境变量: `NEXT_PUBLIC_SITE_URL`（可选，默认 http://localhost:3000）
- 自动部署: 推送到 GitHub 主分支触发
- 构建命令: `npm run build`
- 输出目录: `.next`

---

**最后更新**: 2026-01-13
**维护者**: 小L
