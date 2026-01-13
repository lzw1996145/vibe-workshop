import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import type { Components } from 'react-markdown'

// 生成静态参数（预渲染所有文章页面）
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// 生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: '小L' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['小L'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

// 文章详情组件
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // 获取相关文章（相同分类）
  const allPosts = getAllPosts()
  const relatedPosts = allPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3)

  return (
    <div className="animate-fade-in">
      {/* 面包屑导航 */}
      <nav className="mb-6 text-sm text-[var(--muted-foreground)]">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:opacity-70">
            首页
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:opacity-70">
            分类
          </Link>
          <span>/</span>
          <Link
            href={`/category/${encodeURIComponent(post.category)}`}
            className="hover:opacity-70"
          >
            {post.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{post.title}</span>
        </div>
      </nav>

      {/* 文章头部 */}
      <header className="mb-8 pb-8 border-b border-[var(--border)]">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
          <time>📅 {post.formattedDate}</time>
          <span>⏱️ {post.readingTime}分钟阅读</span>
          <span className="tag bg-[var(--muted)]">
            📁 {post.category}
          </span>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="tag hover:bg-foreground hover:text-background"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 文章内容 */}
      <article className="markdown-content max-w-none mb-12">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeHighlight,
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }]
          ]}
          components={{
            // 自定义代码块样式
            code: (({ node, inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <code className={`hljs language-${match[1]}`} {...props}>
                  {children}
                </code>
              ) : (
                <code className="bg-[var(--muted)] px-1 py-0.5 rounded" {...props}>
                  {children}
                </code>
              )
            }) as Components['code'],
            // 自定义表格样式
            table({ children, ...props }) {
              return (
                <div className="overflow-x-auto my-6">
                  <table className="w-full border-collapse" {...props}>
                    {children}
                  </table>
                </div>
              )
            },
            // 自定义链接样式
            a({ href, children, ...props }) {
              return (
                <a
                  href={href}
                  className="text-[var(--foreground)] hover:underline"
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  {...props}
                >
                  {children}
                </a>
              )
            },
            // 自定义图片样式
            img({ src, alt, ...props }) {
              return (
                <img
                  src={src}
                  alt={alt || ''}
                  className="rounded-lg my-6 max-w-full h-auto"
                  {...props}
                />
              )
            },
          }}
        >
          {post.content}
        </Markdown>
      </article>

      {/* 相关文章 */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-[var(--border)] pt-8">
          <h2 className="text-2xl font-bold mb-6">相关文章</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/post/${relatedPost.slug}`}
                className="card card-hover"
              >
                <h3 className="font-bold mb-2 line-clamp-2">{relatedPost.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-2">
                  {relatedPost.excerpt}
                </p>
                <div className="text-xs text-[var(--muted-foreground)]">
                  {relatedPost.formattedDate}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 文章操作区 */}
      <section className="mt-12 p-6 bg-[var(--muted)]/50 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary btn-sm"
            >
              ← 返回
            </button>
            <Link href="/" className="btn btn-outline btn-sm">
              首页
            </Link>
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                // 复制链接功能
                navigator.clipboard.writeText(window.location.href)
                alert('链接已复制到剪贴板')
              }}
            >
              分享
            </button>
          </div>
        </div>
      </section>

      {/* 页脚信息 */}
      <footer className="mt-16 text-center text-sm text-[var(--muted-foreground)] border-t border-[var(--border)] pt-8">
        <p>
          本文由 {post.title} 发表于 Vibe工坊
        </p>
        <p className="mt-2">
          如需转载，请注明出处
        </p>
      </footer>
    </div>
  )
}
