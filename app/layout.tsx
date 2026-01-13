import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getSiteConfig } from '@/lib/utils'
import ThemeToggle from '@/components/ThemeToggle'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// 网站元数据
export const metadata: Metadata = {
  title: {
    template: '%s | Vibe工坊',
    default: 'Vibe工坊 - 技术笔记与思考',
  },
  description: 'Vehicle Engineering学生的技术笔记，记录电子、嵌入式开发和Vibe Coding的学习历程',
  keywords: ['嵌入式开发', 'STM32', '电子工程', 'Vibe Coding', '技术笔记', '蓝桥杯'],
  authors: [{ name: '小L' }],
  creator: '小L',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Vibe工坊',
    description: 'Vehicle Engineering学生的技术笔记与思考',
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    siteName: 'Vibe工坊',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vibe工坊',
    description: 'Vehicle Engineering学生的技术笔记与思考',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// 根布局组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteConfig = getSiteConfig()

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 移动端菜单脚本
              (function() {
                function toggleMobileMenu() {
                  const menu = document.getElementById('mobile-menu');
                  if (menu) {
                    menu.classList.toggle('hidden');
                  }
                }
                
                // 监听菜单按钮点击
                document.addEventListener('click', function(e) {
                  const menuButton = e.target.closest('[data-menu-toggle]');
                  if (menuButton) {
                    toggleMobileMenu();
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body className={inter.variable}>
        {/* 主容器 */}
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
          {/* 头部导航 */}
          <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--border)]">
            <nav className="container-wide h-16 flex items-center justify-between px-4 sm:px-6">
              {/* Logo */}
              <a
                href="/"
                className="text-xl font-bold hover:opacity-80 transition-opacity"
              >
                {siteConfig.name}
              </a>

              {/* 桌面端导航链接 */}
              <div className="hidden md:flex items-center gap-6 text-sm">
                <a href="/" className="hover:opacity-70 transition-opacity">首页</a>
                <a href="/categories" className="hover:opacity-70 transition-opacity">分类</a>
                <a href="/tags" className="hover:opacity-70 transition-opacity">标签</a>
                <a href="/search" className="hover:opacity-70 transition-opacity">搜索</a>
                <a href="/about" className="hover:opacity-70 transition-opacity">关于</a>
              </div>

              {/* 右侧工具区 */}
              <div className="flex items-center gap-2">
                <ThemeToggle />

                {/* 移动端菜单按钮 */}
                <button
                  data-menu-toggle
                  className="md:hidden p-2 hover:bg-[var(--muted)] rounded transition-colors"
                  aria-label="菜单"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </nav>

            {/* 移动端菜单 */}
            <div
              id="mobile-menu"
              className="hidden md:hidden border-t border-[var(--border)] bg-[var(--background)]"
            >
              <div className="container-wide py-2 flex flex-col gap-1">
                <a
                  href="/"
                  className="px-4 py-2 hover:bg-[var(--muted)] rounded transition-colors"
                >
                  首页
                </a>
                <a
                  href="/categories"
                  className="px-4 py-2 hover:bg-[var(--muted)] rounded transition-colors"
                >
                  分类
                </a>
                <a
                  href="/tags"
                  className="px-4 py-2 hover:bg-[var(--muted)] rounded transition-colors"
                >
                  标签
                </a>
                <a
                  href="/search"
                  className="px-4 py-2 hover:bg-[var(--muted)] rounded transition-colors"
                >
                  搜索
                </a>
                <a
                  href="/about"
                  className="px-4 py-2 hover:bg-[var(--muted)] rounded transition-colors"
                >
                  关于
                </a>
              </div>
            </div>
          </header>

          {/* 主内容区 */}
          <main className="container-narrow py-6 sm:py-8 md:py-12 min-h-[calc(100vh-200px)]">
            {children}
          </main>

          {/* 页脚 */}
          <footer className="border-t border-[var(--border)] mt-16 py-8">
            <div className="container-wide text-center text-sm text-[var(--muted-foreground)]">
              <p className="mb-2">
                © {new Date().getFullYear()} {siteConfig.author}. All rights reserved.
              </p>
              <p className="mb-2">
                {siteConfig.description}
              </p>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors">
                  GitHub
                </a>
                <a href="/rss.xml" className="hover:text-[var(--foreground)] transition-colors">
                  RSS
                </a>
                <a href="/about" className="hover:text-[var(--foreground)] transition-colors">
                  关于
                </a>
              </div>
            </div>
          </footer>
        </div>

        {/* 全局脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 检查系统主题偏好
              (function() {
                const savedTheme = localStorage.getItem('theme');
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
