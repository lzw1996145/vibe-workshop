# Vibe工坊 - 个人技术博客

一个基于 Next.js 14 + Tailwind CSS 4 构建的简约黑白风格个人博客，部署在 Vercel。

## 项目信息

- **博客名称**: Vibe工坊
- **作者**: 小L
- **身份**: Vehicle Engineering 学生
- **内容方向**: 电子工程、嵌入式开发、STM32、Vibe Coding 技术笔记

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS 4
- **内容**: Markdown 文件
- **搜索**: Fuse.js
- **部署**: Vercel

## 功能特性

✅ **核心功能**
- 文章列表展示（首页）
- 文章详情页（支持代码高亮）
- 分类浏览和分类页面
- 标签系统和标签页面
- 全文搜索功能
- RSS 订阅 feed
- 深色/浅色主题切换

✅ **UI 设计**
- 简约黑白风格
- 响应式设计
- 平滑动画过渡
- 自定义滚动条

✅ **技术特性**
- 静态生成 (SSG)
- 自动生成静态参数
- TypeScript 类型安全
- 错误边界处理
- 加载状态优化

## 项目结构

```
vibe-workshop/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   ├── page.tsx           # 首页
│   ├── post/[slug]/       # 文章详情页
│   ├── categories/        # 分类列表
│   ├── category/[slug]/   # 分类详情
│   ├── tags/              # 标签列表
│   ├── tag/[slug]/        # 标签详情
│   ├── search/            # 搜索页面
│   ├── about/             # 关于页面
│   ├── rss/               # RSS 生成器
│   ├── loading.tsx        # 加载状态
│   ├── error.tsx          # 错误边界
│   └── not-found.tsx      # 404 页面
├── components/            # React 组件
│   └── ThemeToggle.tsx    # 主题切换按钮
├── lib/                   # 工具函数
│   ├── posts.ts           # 文章处理系统
│   └── utils.ts           # 通用工具
├── content/               # Markdown 内容
│   └── posts/             # 文章文件
├── public/                # 静态资源
├── package.json           # 依赖配置
├── next.config.js         # Next.js 配置
├── tailwind.config.ts     # Tailwind 配置
├── postcss.config.js      # PostCSS 配置
├── tsconfig.json          # TypeScript 配置
└── vercel.json            # Vercel 配置
```

## 内容管理

文章使用 Markdown 格式存储在 `content/posts/` 目录下，文件名格式：

```
YYYY-MM-DD-文章标题.md
```

自动分类规则：
- 文件名包含 `蓝桥杯` → `竞赛经验`
- 文件名包含 `STM32` 或 `嵌入式` → `嵌入式开发`
- 其他 → `技术笔记`

Markdown Frontmatter 示例：
```markdown
---
title: 文章标题
date: 2024-01-01
tags: [STM32, 嵌入式]
---
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

访问 http://localhost:3000

## Vercel 部署

1. 推送代码到 GitHub 仓库
2. 在 Vercel 控制台导入项目
3. 配置环境变量（可选）：
   - `NEXT_PUBLIC_SITE_URL`: 网站 URL
4. 部署完成！

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_SITE_URL` | 网站 URL | `http://localhost:3000` |

## 自定义配置

在 `lib/utils.ts` 中修改网站配置：

```typescript
export function getSiteConfig() {
  return {
    name: 'Vibe工坊',
    description: 'Vehicle Engineering学生的技术笔记...',
    author: '小L',
    // ...
  }
}
```

## 许可证

MIT License

---

Built with ❤️ by 小L
