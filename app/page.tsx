import { getAllPosts, getAllCategories } from '@/lib/posts'
import { getSiteConfig } from '@/lib/utils'
import Link from 'next/link'

// 首页组件
export default async function HomePage() {
  const posts = getAllPosts()
  const categories = getAllCategories()
  const siteConfig = getSiteConfig()

  // 只显示最近的9篇文章
  const recentPosts = posts.slice(0, 9)

  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-in">
      {/* 英雄区域 */}
      <section className="text-center py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
          {siteConfig.name}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-4 sm:mb-6">
          {siteConfig.description}
        </p>
        <div className="flex justify-center gap-3 sm:gap-4 flex-wrap px-2">
          <Link
            href="/categories"
            className="btn btn-primary btn-sm sm:btn-lg"
          >
            浏览分类
          </Link>
          <Link
            href="/search"
            className="btn btn-outline btn-sm sm:btn-lg"
          >
            搜索文章
          </Link>
        </div>
      </section>

      {/* 分类快速导航 */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">分类浏览</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/category/${encodeURIComponent(category)}`}
              className="tag hover:bg-foreground hover:text-background transition-all text-sm"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* 最近文章 */}
      <section>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">最新文章</h2>
          <Link href="/posts" className="text-sm hover:opacity-70 transition-opacity">
            查看全部 →
          </Link>
        </div>

        {/* 响应式网格布局 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recentPosts.map((post, index) => (
            <article
              key={post.slug}
              className="card card-hover animate-fade-in flex flex-col"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Link href={`/post/${post.slug}`} className="block h-full flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-[var(--muted-foreground)]">
                  <span className="tag text-xs">{post.category}</span>
                  <time className="text-xs">{post.formattedDate}</time>
                  <span className="text-xs">{post.readingTime}分钟</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold mb-2 line-clamp-2 hover:opacity-80 transition-opacity">
                  {post.title}
                </h3>

                <p className="text-sm text-[var(--muted-foreground)] mb-4 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-1 mt-auto">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs text-[var(--muted-foreground)]">
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-[var(--muted-foreground)]">
                      +{post.tags.length - 3}
                    </span>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>

        {recentPosts.length === 0 && (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            <p className="text-sm sm:text-base">暂无文章，请添加Markdown文件到 content/posts/ 目录</p>
          </div>
        )}
      </section>

      {/* 统计信息 */}
      <section className="border-t border-[var(--border)] pt-6 sm:pt-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="px-2">
            <div className="text-2xl sm:text-3xl font-bold">{posts.length}</div>
            <div className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">文章总数</div>
          </div>
          <div className="px-2">
            <div className="text-2xl sm:text-3xl font-bold">{categories.length}</div>
            <div className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">分类数量</div>
          </div>
          <div className="px-2">
            <div className="text-2xl sm:text-3xl font-bold">
              {posts.reduce((acc, post) => acc + post.readingTime, 0)}
            </div>
            <div className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">总阅读分钟</div>
          </div>
        </div>
      </section>
    </div>
  )
}
