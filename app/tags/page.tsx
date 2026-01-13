import { getAllTags, getPostsByTag, getAllPosts } from '@/lib/posts'
import Link from 'next/link'

export const metadata = {
  title: '所有标签',
  description: '按标签浏览所有技术笔记',
}

export default async function TagsPage() {
  const tags = getAllTags()
  const allPosts = getAllPosts()

  // 获取每个标签的文章数量
  const tagCounts = tags.map(tag => ({
    tag,
    count: getPostsByTag(tag).length,
  }))

  // 按文章数量排序
  const sortedTags = tagCounts.sort((a, b) => b.count - a.count)

  // 计算标签大小分布（用于标签云）
  const maxCount = Math.max(...tagCounts.map(t => t.count))
  const minCount = Math.min(...tagCounts.map(t => t.count))

  const getTagSize = (count: number) => {
    if (maxCount === minCount) return 'text-base'
    const ratio = (count - minCount) / (maxCount - minCount)
    if (ratio > 0.7) return 'text-xl font-bold'
    if (ratio > 0.4) return 'text-lg font-semibold'
    if (ratio > 0.2) return 'text-base'
    return 'text-sm'
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">所有标签</h1>
        <p className="text-[var(--muted-foreground)]">
          共 {tags.length} 个标签，{allPosts.length} 篇文章
        </p>
      </header>

      {/* 标签云 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">标签云</h2>
        <div className="flex flex-wrap gap-3 items-center justify-center min-h-[100px] p-6 bg-[var(--muted)]/50 rounded-lg">
          {sortedTags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className={`tag hover:bg-foreground hover:text-background transition-all ${getTagSize(count)} px-3 py-1`}
              title={`${tag} (${count} 篇文章)`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </section>

      {/* 标签列表（带统计） */}
      <section>
        <h2 className="text-2xl font-bold mb-4">标签列表</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {sortedTags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className="card card-hover flex items-center justify-between"
            >
              <span className="font-medium">#{tag}</span>
              <span className="text-sm text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-1 rounded">
                {count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 统计信息 */}
      <section className="mt-12 border-t border-[var(--border)] pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold">{tags.length}</div>
            <div className="text-sm text-[var(--muted-foreground)] mt-1">标签总数</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {Math.round(allPosts.length / Math.max(tags.length, 1))}
            </div>
            <div className="text-sm text-[var(--muted-foreground)] mt-1">平均每标签</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{maxCount}</div>
            <div className="text-sm text-[var(--muted-foreground)] mt-1">最多文章</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{minCount}</div>
            <div className="text-sm text-[var(--muted-foreground)] mt-1">最少文章</div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            标签大小表示该标签下的文章数量，点击标签查看详细内容
          </p>
        </div>
      </section>

      {/* 快速导航 */}
      <section className="mt-12 p-6 bg-[var(--muted)]/50 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-[var(--muted-foreground)]">
            浏览所有标签内容
          </div>
          <div className="flex gap-2">
            <Link href="/categories" className="btn btn-outline btn-sm">
              分类浏览
            </Link>
            <Link href="/search" className="btn btn-secondary btn-sm">
              搜索
            </Link>
            <Link href="/" className="btn btn-primary btn-sm">
              首页
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
