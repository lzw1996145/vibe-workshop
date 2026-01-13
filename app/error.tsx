'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 可以在这里记录错误到日志服务
    console.error('页面错误:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="mb-6">
        <svg
          className="w-20 h-20 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold mb-2">发生错误</h2>
      <p className="text-[var(--muted-foreground)] mb-6 max-w-md">
        抱歉，页面加载时出现了问题。请稍后重试，或返回首页。
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="btn btn-primary"
        >
          重试
        </button>
        <a href="/" className="btn btn-secondary">
          返回首页
        </a>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-[var(--muted)] rounded text-left text-sm font-mono max-w-lg overflow-auto">
          <div className="font-bold mb-2">错误详情（仅开发环境显示）:</div>
          <div>{error.message}</div>
        </div>
      )}
    </div>
  )
}
