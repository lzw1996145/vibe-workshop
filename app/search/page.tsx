import { getAllPosts, searchPosts } from '@/lib/posts'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata = {
  title: '搜索文章',
  description: '搜索所有技术笔记和文章',
}

// 搜索页面组件
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''
  const allPosts = getAllPosts()

  // 如果没有查询，显示所有文章
  const results = query ? searchPosts(query) : allPosts
  const hasResults = results.length > 0

  return (
    <div className="animate-fade-in">
      {/* 搜索框 */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">搜索文章</h1>

        <form action="/search" method="GET" className="relative">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="输入关键词搜索文章（标题、内容、标签）..."
            className="w-full px-4 py-3 text-lg border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-foreground/20"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary btn-sm"
          >
            搜索
          </button>
        </form>

        {query && (
          <div className="mt-4 text-sm text-[var(--muted-foreground)]">
            搜索结果：找到 {results.length} 篇文章
            <Link href="/search" className="ml-2 text-[var(--foreground)] hover:underline">
              清除搜索
            </Link>
          </div>
        )}
      </header>

      {/* 搜索结果 */}
      <Suspense fallback={<div className="text-center py-8">搜索中...</div>}>
        <SearchResults results={results} query={query} />
      </Suspense>

      {/* 热门标签 */}
      <PopularTags />

      {/* 快速分类导航 */}
      <QuickCategories />
    </div>
  )
}

// 搜索结果组件
function SearchResults({ results, query }: { results: any[]; query: string }) {
  if (!query) {
    return (
      <div className="text-center py-8 text-[var(--muted-foreground)]">
        <p>输入关键词开始搜索，或浏览下方的所有文章</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--muted-foreground)]">
        <p className="text-lg mb-2">未找到匹配的文章</p>
        <p className="text-sm">试试其他关键词，或浏览下方的推荐</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 mb-12">
      {results.map((post, index) => (
        <article
          key={post.slug}
          className="card card-hover animate-fade-in"
          style={{ animationDelay: `${index * 0.03}s` }}
        >
          <Link href={`/post/${post.slug}`} className="block">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] flex-wrap">
                <span className="tag">{post.category}</span>
                <time>{post.formattedDate}</time>
                <span>{post.readingTime}分钟</span>
              </div>
              <h3 className="text-lg font-bold hover:opacity-80">
                {post.title}
              </h3>
              <p className="text-[var(--muted-foreground)] text-sm line-clamp-2">
                {post.excerpt}
              </p>
              {post.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {post.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-xs text-[var(--muted-foreground)]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}

// 热门标签组件
async function PopularTags() {
  const { getAllTags } = await import('@/lib/posts')
  const tags = getAllTags()
  const popularTags = tags.slice(0, 10)

  if (popularTags.length === 0) return null

  return (
    <section className="mt-12 border-t border-[var(--border)] pt-8">
      <h2 className="text-2xl font-bold mb-4">热门标签</h2>
      <div className="flex flex-wrap gap-2">
        {popularTags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${encodeURIComponent(tag)}`}
            className="tag hover:bg-foreground hover:text-background transition-all"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </section>
  )
}

// 快速分类导航组件
async function QuickCategories() {
  const { getAllCategories } = await import('@/lib/posts')
  const categories = getAllCategories()

  return (
    <section className="mt-8 border-t border-[var(--border)] pt-8">
      <h2 className="text-2xl font-bold mb-4">快速浏览</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/category/${encodeURIComponent(category)}`}
            className="btn btn-outline btn-sm"
          >
            {category}
          </Link>
        ))}
        <Link href="/categories" className="btn btn-secondary btn-sm">
          所有分类 →
        </Link>
      </div>
    </section>
  )
}
