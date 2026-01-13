import { getPostsByCategory, getAllCategories } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// 生成静态参数
export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((category) => ({
    slug: encodeURIComponent(category),
  }))
}

// 生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = decodeURIComponent(params.slug)
  const posts = getPostsByCategory(category)

  if (posts.length === 0) {
    return {
      title: '分类未找到',
    }
  }

  return {
    title: `${category} - 分类`,
    description: `${category} 分类下的所有文章，共 ${posts.length} 篇`,
  }
}

// 分类详情组件
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = decodeURIComponent(params.slug)
  const posts = getPostsByCategory(category)

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="animate-fade-in">
      {/* 头部 */}
      <header className="mb-8 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {category}
            </h1>
            <p className="text-[var(--muted-foreground)]">
              共 {posts.length} 篇文章
            </p>
          </div>
          <Link href="/categories" className="btn btn-secondary">
            ← 返回所有分类
          </Link>
        </div>
      </header>

      {/* 文章列表 */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            className="card card-hover animate-fade-in"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <Link href={`/post/${post.slug}`} className="block">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 hover:opacity-80">
                    {post.title}
                  </h2>
                  <p className="text-[var(--muted-foreground)] text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)] flex-wrap">
                    <time>📅 {post.formattedDate}</time>
                    <span>⏱️ {post.readingTime}分钟</span>
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="tag text-xs px-2 py-0.5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* 如果没有文章 */}
      {posts.length === 0 && (
        <div className="text-center py-12 text-[var(--muted-foreground)]">
          <p>该分类下暂无文章</p>
          <Link href="/categories" className="btn btn-primary mt-4">
            浏览其他分类
          </Link>
        </div>
      )}

      {/* 分类统计和导航 */}
      <section className="mt-12 p-6 bg-[var(--muted)]/50 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-[var(--muted-foreground)]">
            <span className="font-semibold">{category}</span> 分类下的精选内容
          </div>
          <div className="flex gap-2">
            <Link href="/categories" className="btn btn-outline btn-sm">
              所有分类
            </Link>
            <Link href="/" className="btn btn-secondary btn-sm">
              首页
            </Link>
          </div>
        </div>
      </section>

      {/* 相关分类推荐 */}
      <RelatedCategories currentCategory={category} />
    </div>
  )
}

// 相关分类组件
async function RelatedCategories({ currentCategory }: { currentCategory: string }) {
  const allCategories = getAllCategories()
  const otherCategories = allCategories.filter(c => c !== currentCategory).slice(0, 5)

  if (otherCategories.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">其他分类</h2>
      <div className="flex flex-wrap gap-2">
        {otherCategories.map((category) => (
          <Link
            key={category}
            href={`/category/${encodeURIComponent(category)}`}
            className="tag hover:bg-foreground hover:text-background transition-all"
          >
            {category}
          </Link>
        ))}
      </div>
    </section>
  )
}
