// 格式化HTML内容（用于MDX渲染前的处理）
export function formatHtmlContent(html: string): string {
  return html
}

// 生成URL友好的slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// 检查是否是开发环境
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

// 获取网站配置
export function getSiteConfig() {
  return {
    name: 'Vibe工坊',
    author: '小L',
    description: 'Vehicle Engineering学生的技术笔记，记录电子、嵌入式开发和Vibe Coding的学习历程',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    categories: ['电子信息', '嵌入式开发', '竞赛经验', 'Vibe Coding']
  }
}

// 分页工具函数
export function paginate<T>(items: T[], page: number = 1, perPage: number = 10): {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
} {
  const total = items.length
  const totalPages = Math.ceil(total / perPage)
  const startIndex = (page - 1) * perPage
  const endIndex = startIndex + perPage
  const paginatedItems = items.slice(startIndex, endIndex)

  return {
    items: paginatedItems,
    total,
    page,
    perPage,
    totalPages,
    hasPrev: page > 1,
    hasNext: page < totalPages
  }
}

// 简单的文本截断
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 生成随机ID（用于临时标识）
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// 延迟工具（用于动画等）
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 检查字符串是否为空或仅包含空白字符
export function isEmptyOrWhitespace(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0
}

// 从内容中提取第一个图片URL（用于文章封面）
export function extractFirstImage(content: string): string | null {
  const imageRegex = /!\[.*?\]\((.*?)\)/
  const match = content.match(imageRegex)
  return match ? match[1] : null
}

// 计算文章字数
export function countWords(content: string): number {
  // 移除代码块、Markdown语法等
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*`~\-]/g, '')
    .replace(/\|/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return cleanContent.split(' ').filter(w => w.length > 0).length
}

// 格式化阅读时间显示
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return '不到1分钟'
  if (minutes === 1) return '1分钟'
  return `${minutes}分钟`
}

// 生成面包屑导航路径
export function generateBreadcrumbs(paths: { name: string; href?: string }[]): string {
  return paths.map(p => p.name).join(' > ')
}

// 检查是否是有效的URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 获取当前年份（用于页脚版权）
export function getCurrentYear(): number {
  return new Date().getFullYear()
}
