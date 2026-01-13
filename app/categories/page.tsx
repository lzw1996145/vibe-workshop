import { getAllCategories, getPostsByCategory, getAllPosts } from '@/lib/posts'
import Link from 'next/link'

export const metadata = {
  title: '文章分类',
  description: '按分类浏览所有技术笔记',
}

export default async function CategoriesPage() {
  const categories = getAllCategories()
  const allPosts = getAllPosts()

  // 获取每个分类的文章数量
  const categoryCounts = categories.map(category => ({
    category,
    count: getPostsByCategory(category).length,
  }))

  return (
    <div className="animate-fade-in">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">文章分类</h1>
        <p className="text-[var(--muted-foreground)]">
          共 {allPosts.length} 篇文章，分为 {categories.length} 个分类
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoryCounts.map(({ category, count }) => (
          <Link
            key={category}
            href={`/category/${encodeURIComponent(category)}`}
            className="card card-hover group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1 group-hover:opacity-80">
                  {category}
                </h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {count} 篇文章
                </p>
              </div>
              <svg
                className="w-6 h-6 text-[var(--muted-foreground)] group-hover:text-foreground transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* 所有分类的标签云 */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">所有分类</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/category/${encodeURIComponent(category)}`}
              className="tag hover:bg-foreground hover:text-background transition-all text-base px-4 py-2"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* 快速统计 */}
      <section className="mt-12 border-t border-[var(--border)] pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{allPosts.length}</div>
            <div className="text-sm text-[var(--muted-foreground)]">总文章</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-[var(--muted-foreground)]">分类数</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {Math.max(...categoryCounts.map(c => c.count))}
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">最多文章</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {Math.min(...categoryCounts.map(c => c.count))}
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">最少文章</div>
          </div>
        </div>
      </section>

      {/* 返回首页 */}
      <div className="mt-8 text-center">
        <Link href="/" className="btn btn-secondary">
          ← 返回首页
        </Link>
      </div>
    </div>
  )
}
