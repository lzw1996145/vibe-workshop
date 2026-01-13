'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PostActions() {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
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
            onClick={handleCopyLink}
          >
            {copied ? '已复制 ✓' : '分享'}
          </button>
        </div>
      </div>
    </section>
  )
}
