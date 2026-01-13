import { getSiteConfig } from '@/lib/utils'
import Link from 'next/link'

export const metadata = {
  title: '关于',
  description: '关于Vibe工坊和作者小L',
}

export default function AboutPage() {
  const siteConfig = getSiteConfig()

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">关于</h1>
        <p className="text-[var(--muted-foreground)]">
          {siteConfig.name} 的故事
        </p>
      </header>

      {/* 关于博客 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">关于 {siteConfig.name}</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
          <p>
            <strong>{siteConfig.name}</strong> 是一个专注于技术笔记和学习记录的个人博客。
            这里记录了我在车辆工程学习过程中对电子技术、嵌入式开发以及Vibe Coding的探索与思考。
          </p>
          <p>
            博客采用现代化的技术栈构建，使用 Next.js 和 Tailwind CSS，部署在 Vercel 平台。
            所有内容都以 Markdown 格式存储，便于版本管理和内容迁移。
          </p>
          <p>
            这里的每一篇文章都是学习过程的真实记录，希望能为同样在技术道路上探索的朋友们提供一些参考和启发。
          </p>
        </div>
      </section>

      {/* 关于作者 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">关于作者</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
          <p>
            <strong>小L</strong> - 车辆工程专业本科生，技术爱好者。
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>专业背景：</strong> 车辆工程，专注于汽车电子和智能控制方向
            </li>
            <li>
              <strong>技术兴趣：</strong> 嵌入式系统、STM32开发、电子电路设计、自动化控制
            </li>
            <li>
              <strong>编程爱好：</strong> Vibe Coding、快速原型开发、工具自动化
            </li>
            <li>
              <strong>竞赛经历：</strong> 蓝桥杯等电子设计竞赛参与者
            </li>
          </ul>
          <p>
            相信"实践是最好的老师"，通过动手做项目来学习和掌握新技术。
            喜欢分享学习过程中的经验和教训，记录技术成长的点滴。
          </p>
        </div>
      </section>

      {/* 技术栈 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">技术栈</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-bold mb-2">前端</h3>
            <ul className="text-sm space-y-1 text-[var(--muted-foreground)]">
              <li>• Next.js 14 (App Router)</li>
              <li>• React 19</li>
              <li>• Tailwind CSS</li>
              <li>• TypeScript</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="font-bold mb-2">内容与部署</h3>
            <ul className="text-sm space-y-1 text-[var(--muted-foreground)]">
              <li>• Markdown/MDX</li>
              <li>• Vercel 部署</li>
              <li>• GitHub 版本控制</li>
              <li>• 静态生成 (SSG)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 联系方式 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">联系方式</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            GitHub
          </a>
          <a
            href="mailto:example@email.com"
            className="btn btn-outline"
          >
            Email
          </a>
          <Link href="/search" className="btn btn-secondary">
            搜索文章
          </Link>
        </div>
      </section>

      {/* 致谢 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">致谢</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>
            感谢所有在技术道路上给予帮助和指导的老师、同学和网友。
            感谢开源社区提供的优秀工具和框架，让个人博客的搭建变得如此简单。
          </p>
          <p>
            特别感谢 Next.js、Tailwind CSS 和 Vercel 团队，提供了如此优秀的开发体验和部署服务。
          </p>
        </div>
      </section>

      {/* 底部导航 */}
      <section className="border-t border-[var(--border)] pt-8">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn btn-primary">
            首页
          </Link>
          <Link href="/categories" className="btn btn-secondary">
            分类
          </Link>
          <Link href="/tags" className="btn btn-secondary">
            标签
          </Link>
          <Link href="/search" className="btn btn-outline">
            搜索
          </Link>
        </div>
      </section>

      {/* 版权信息 */}
      <footer className="mt-12 text-center text-sm text-[var(--muted-foreground)]">
        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        <p className="mt-1">Made with ❤️ by {siteConfig.author}</p>
      </footer>
    </div>
  )
}
