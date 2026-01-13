import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="mb-6">
        <svg
          className="w-24 h-24 text-[var(--muted-foreground)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-6xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-bold mb-4">页面未找到</h2>
      <p className="text-[var(--muted-foreground)] mb-8 max-w-md">
        抱歉，你访问的页面不存在或已被移除。请检查URL是否正确，或返回首页。
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn btn-primary btn-lg">
          返回首页
        </Link>
        <Link href="/search" className="btn btn-secondary btn-lg">
          搜索文章
        </Link>
        <Link href="/categories" className="btn btn-outline btn-lg">
          浏览分类
        </Link>
      </div>

      {/* 有用的提示 */}
      <div className="mt-12 p-6 bg-[var(--muted)]/50 rounded-lg max-w-md text-sm text-[var(--muted-foreground)]">
        <p className="mb-2 font-semibold">可能的原因：</p>
        <ul className="list-disc pl-5 space-y-1 text-left">
          <li>URL地址输入错误</li>
          <li>文章已被移除或重命名</li>
          <li>链接已过期</li>
        </ul>
      </div>
    </div>
  )
}
