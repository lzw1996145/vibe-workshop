import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { format } from 'date-fns'

// 博客文章的元数据接口
export interface PostMeta {
  slug: string
  title: string
  date: string
  formattedDate: string
  category: string
  tags: string[]
  excerpt: string
  readingTime: number
}

// 完整文章接口
export interface Post extends PostMeta {
  content: string
  rawContent: string
}

// 内容目录路径
const postsDirectory = path.join(process.cwd(), 'content', 'posts')

// 获取所有Markdown文件路径
function getPostFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'))
}

// 从文件名生成分类和标签
function generateCategoryAndTags(filename: string): { category: string; tags: string[] } {
  // 移除.md后缀
  const name = filename.replace(/\.md$/, '')

  // 根据文件名特征分类
  let category = '其他'
  const tags: string[] = []

  if (name.includes('STM32') || name.includes('stm32')) {
    category = '嵌入式开发'
    tags.push('STM32')
  }
  if (name.includes('蓝桥杯')) {
    category = '竞赛经验'
    tags.push('蓝桥杯')
  }
  if (name.includes('GPIO') || name.includes('中断')) {
    tags.push('GPIO', '中断')
  }
  if (name.includes('调度器') || name.includes('框架')) {
    tags.push('调度器', '框架')
  }

  // 如果没有匹配到特定分类，使用通用分类
  if (category === '其他') {
    category = '技术笔记'
  }

  return { category, tags }
}

// 计算阅读时间（基于字数，假设每分钟阅读300字）
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / 300)
}

// 提取摘要（前150个字）
function extractExcerpt(content: string): string {
  // 移除代码块、表格等特殊格式
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<table>[\s\S]*?<\/table>/g, '')
    .replace(/[#>*`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  return cleanContent.substring(0, 150) + (cleanContent.length > 150 ? '...' : '')
}

// 获取所有文章的元数据（按日期倒序）
export function getAllPosts(): PostMeta[] {
  const files = getPostFiles()

  const posts = files.map(file => {
    const filePath = path.join(postsDirectory, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    // 从文件名生成slug（URL友好的标识符）
    const slug = file.replace(/\.md$/, '')

    // 从front matter或文件名生成元数据
    const date = data.date ? new Date(data.date) : new Date()
    const { category, tags } = generateCategoryAndTags(file)

    // 合并front matter中的标签
    const allTags = [...tags, ...(data.tags || [])]

    // 去重
    const uniqueTags = [...new Set(allTags)]

    return {
      slug,
      title: data.title || slug,
      date: date.toISOString(),
      formattedDate: format(date, 'yyyy年MM月dd日'),
      category: data.category || category,
      tags: uniqueTags,
      excerpt: data.excerpt || extractExcerpt(content),
      readingTime: calculateReadingTime(content)
    }
  })

  // 按日期倒序排序
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// 根据slug获取单篇文章
export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDirectory, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  const { category, tags } = generateCategoryAndTags(`${slug}.md`)

  // 合并front matter中的标签
  const allTags = [...tags, ...(data.tags || [])]
  const uniqueTags = [...new Set(allTags)]

  const date = data.date ? new Date(data.date) : new Date()

  return {
    slug,
    title: data.title || slug,
    date: date.toISOString(),
    formattedDate: format(date, 'yyyy年MM月dd日'),
    category: data.category || category,
    tags: uniqueTags,
    excerpt: data.excerpt || extractExcerpt(content),
    readingTime: calculateReadingTime(content),
    content: content,
    rawContent: fileContent
  }
}

// 获取所有分类
export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = posts.map(post => post.category)
  return [...new Set(categories)].sort()
}

// 获取所有标签
export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = posts.flatMap(post => post.tags)
  return [...new Set(tags)].sort()
}

// 根据分类筛选文章
export function getPostsByCategory(category: string): PostMeta[] {
  const posts = getAllPosts()
  return posts.filter(post => post.category === category)
}

// 根据标签筛选文章
export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts()
  return posts.filter(post => post.tags.includes(tag))
}

// 搜索文章（标题、摘要、内容）
export function searchPosts(query: string): PostMeta[] {
  const posts = getAllPosts()
  const lowerQuery = query.toLowerCase()

  return posts.filter(post => {
    const content = fs.readFileSync(path.join(postsDirectory, `${post.slug}.md`), 'utf-8')
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      content.toLowerCase().includes(lowerQuery)
    )
  })
}
