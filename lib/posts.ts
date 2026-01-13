import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { format } from 'date-fns'

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

export interface Post extends PostMeta {
  content: string
  rawContent: string
}

const postsDirectory = path.join(process.cwd(), 'content', 'posts')

function getPostFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'))
}

function extractTitleFromContent(content: string): string {
  if (!content) return '未命名文章'
  const match = content.match(/^#\s+(.+)$/m)
  if (match) {
    return match[1].trim()
  }
  return '未命名文章'
}

function generateCategoryAndTags(filename: string, content: string = ''): { category: string; tags: string[] } {
  const safeContent = content || ''
  const name = filename.replace(/\.md$/, '')
  const lowerName = name.toLowerCase()
  const lowerContent = safeContent.toLowerCase()

  let category = '技术笔记'
  const tags: string[] = []

  if (lowerName.includes('stm32') || lowerContent.includes('stm32') || 
      lowerName.includes('gpio') || lowerContent.includes('gpio')) {
    category = '嵌入式开发'
    if (!tags.includes('STM32')) tags.push('STM32')
  }

  if (lowerName.includes('蓝桥杯') || lowerName.includes('ct117e')) {
    category = '竞赛经验'
    if (!tags.includes('蓝桥杯')) tags.push('蓝桥杯')
  }

  if (lowerName.includes('at2402') || lowerContent.includes('at2402') ||
      lowerName.includes('ds18b20') || lowerContent.includes('ds18b20') ||
      lowerName.includes('pcf8591') || lowerContent.includes('pcf8591')) {
    category = '嵌入式开发'
    tags.push('外设模块')
  }

  const contentKeywords = {
    '中断': ['中断', 'exti'],
    '定时器': ['定时器', 'tim', 'pwm'],
    'ADC': ['adc', '模数转换', 'dma'],
    'I2C': ['i2c', 'at2402'],
    '串口': ['uart', 'usart', '串口'],
    'LED': ['led', '锁存器'],
    'LCD': ['lcd'],
    '按键': ['key', '按键'],
    'GPIO': ['gpio', '引脚'],
    '编码器': ['encoder', '编码器'],
  }

  for (const [tag, keywords] of Object.entries(contentKeywords)) {
    if (keywords.some(keyword => lowerContent.includes(keyword)) && !tags.includes(tag)) {
      tags.push(tag)
    }
  }

  if (lowerName.includes('调度器') || lowerName.includes('框架') || 
      lowerContent.includes('调度器') || lowerContent.includes('框架')) {
    if (!tags.includes('调度器')) tags.push('调度器')
    if (!tags.includes('框架')) tags.push('框架')
  }

  return { category, tags }
}

function generateSlug(filename: string): string {
  const name = filename.replace(/\.md$/, '')
  
  let slug = name
    .replace(/\s+/g, '-')
    .replace(/[、，。！？；：""''（）\(\)\[\]]/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim()
  
  if (!slug) {
    slug = name
  }
  
  return slug
}

function calculateReadingTime(content: string): number {
  if (!content) return 1
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\n\s*\n/g, '\n')
  
  const words = cleanContent.trim().split(/\s+/).length
  const time = Math.ceil(words / 300)
  return Math.max(1, time)
}

function extractExcerpt(content: string): string {
  const safeContent = content || ''
  const cleanContent = safeContent
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<table>[\s\S]*?<\/table>/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/[#>*`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleanContent.length <= 150) {
    return cleanContent
  }
  return cleanContent.substring(0, 150) + '...'
}

export function getAllPosts(): PostMeta[] {
  const files = getPostFiles()

  const posts = files.map(file => {
    try {
      const filePath = path.join(postsDirectory, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)

      const slug = generateSlug(file)
      let title = data.title || extractTitleFromContent(content) || slug

      const stats = fs.statSync(filePath)
      const date = data.date ? new Date(data.date) : new Date(stats.mtime)

      const { category, tags } = generateCategoryAndTags(file, content || '')
      const allTags = [...tags, ...(data.tags || [])]
      const uniqueTags = [...new Set(allTags)]

      return {
        slug,
        title,
        date: date.toISOString(),
        formattedDate: format(date, 'yyyy年MM月dd日'),
        category: data.category || category,
        tags: uniqueTags,
        excerpt: data.excerpt || extractExcerpt(content || ''),
        readingTime: calculateReadingTime(content || '')
      }
    } catch (error) {
      console.error('Error processing file:', file, error)
      return null
    }
  }).filter((post): post is PostMeta => post !== null)

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const possibleFiles = [
      `${slug}.md`,
      `${encodeURIComponent(slug)}.md`,
    ]

    let filePath: string | null = null
    for (const file of possibleFiles) {
      const testPath = path.join(postsDirectory, file)
      if (fs.existsSync(testPath)) {
        filePath = testPath
        break
      }
    }

    if (!filePath) {
      const files = getPostFiles()
      const matchedFile = files.find(file => {
        const fileSlug = generateSlug(file)
        return fileSlug === slug || fileSlug.toLowerCase() === slug.toLowerCase()
      })
      
      if (matchedFile) {
        filePath = path.join(postsDirectory, matchedFile)
      }
    }

    if (!filePath) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const stats = fs.statSync(filePath)
    const date = data.date ? new Date(data.date) : new Date(stats.mtime)

    let title = data.title || extractTitleFromContent(content || '') || slug

    const { category, tags } = generateCategoryAndTags(path.basename(filePath), content || '')
    const allTags = [...tags, ...(data.tags || [])]
    const uniqueTags = [...new Set(allTags)]

    return {
      slug,
      title,
      date: date.toISOString(),
      formattedDate: format(date, 'yyyy年MM月dd日'),
      category: data.category || category,
      tags: uniqueTags,
      excerpt: data.excerpt || extractExcerpt(content || ''),
      readingTime: calculateReadingTime(content || ''),
      content: content || '',
      rawContent: fileContent
    }
  } catch (error) {
    console.error('Error getting post by slug:', slug, error)
    return null
  }
}

export function getAllCategories(): string[] {
  const posts = getAllPosts()
  const categories = posts.map(post => post.category)
  return [...new Set(categories)].sort()
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = posts.flatMap(post => post.tags)
  return [...new Set(tags)].sort()
}

export function getPostsByCategory(category: string): PostMeta[] {
  const posts = getAllPosts()
  return posts.filter(post => post.category === category)
}

export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts()
  return posts.filter(post => post.tags.includes(tag))
}

export function searchPosts(query: string): PostMeta[] {
  const posts = getAllPosts()
  const lowerQuery = query.toLowerCase()

  return posts.filter(post => {
    const filePath = path.join(postsDirectory, `${post.slug}.md`)
    if (!fs.existsSync(filePath)) return false
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      return (
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        (content && content.toLowerCase().includes(lowerQuery)) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    } catch {
      return false
    }
  })
}
