import { getPostsByTag, getAllTags } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// 生成静态参数
export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({
    slug: encodeURIComponent(tag),
  }))
}

// 生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tag = decodeURIComponent(params.slug)
  const posts = getPostsByTag(tag)

  if (posts.length === 0) {
    return {
      title: '标签未找到',
    }
  }

  return {
    title: `#${tag} - 标签`,
    description: `包含标签 #${tag} 的文章，共 ${posts.length} 篇`,
  }
}

// 标签详情组件
export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = decodeURIComponent(params.slug)
  const posts = getPostsByTag(tag)

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
              <span className="text-[var(--muted-foreground)]">#</span>
              {tag}
            </h1>
            <p className="text-[var(--muted-foreground)]">
              包含此标签的文章共 {posts.length} 篇
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/tags" className="btn btn-secondary">
              ← 所有标签
            </Link>
            <Link href="/search" className="btn btn-outline">
              搜索
            </Link>
          </div>
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
                  <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mb-2 flex-wrap">
                    <span className="tag">{post.category}</span>
                    <time>{post.formattedDate}</time>
                    <span>{post.readingTime}分钟</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 hover:opacity-80">
                    {post.title}
                  </h2>
                  <p className="text-[var(--muted-foreground)] text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {post.tags.map((t: string) => (
                      <span
                        key={t}
                        className={`text-xs px-2 py-0.5 rounded ${
                          t === tag
                            ? 'bg-foreground text-background'
                            : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                        }`}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* 相关标签推荐 */}
      <RelatedTags currentTag={tag} />

      {/* 底部操作区 */}
      <section className="mt-12 p-6 bg-[var(--muted)]/50 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-[var(--muted-foreground)]">
            标签 <span className="font-semibold">#{tag}</span> 下的所有文章
          </div>
          <div className="flex gap-2">
            <Link href="/tags" className="btn btn-outline btn-sm">
              所有标签
            </Link>
            <Link href="/" className="btn btn-secondary btn-sm">
              首页
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// 相关标签组件
async function RelatedTags({ currentTag }: { currentTag: string }) {
  const { getAllTags, getPostsByTag } = await import('@/lib/posts')
  const allTags = getAllTags()

  // 找出与当前标签有共同文章的其他标签
  const relatedTags = allTags
    .filter(tag => tag !== currentTag)
    .filter(tag => {
      const currentPosts = getPostsByTag(currentTag).map(p => p.slug)
      const otherPosts = getPostsByTag(tag).map(p => p.slug)
      return currentPosts.some(slug => otherPosts.includes(slug))
    })
    .slice(0, 8)

  if (relatedTags.length === 0) return null

  return (
    <section className="mt-12 border-t border-[var(--border)] pt-8">
      <h2 className="text-2xl font-bold mb-4">相关标签</h2>
      <div className="flex flex-wrap gap-2">
        {relatedTags.map((tag) => (
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
