/** @type {import('next').NextConfig} */
const nextConfig = {
  // 配置页面扩展
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // 配置图像优化
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },

  // 配置环境变量
  env: {
    SITE_NAME: 'Vibe工坊',
    SITE_AUTHOR: '小L',
  },

  // 配置重写规则（用于URL美化）
  async rewrites() {
    return [
      {
        source: '/posts/:slug',
        destination: '/post/:slug',
      },
    ]
  },

  // 配置压缩（生产环境）
  compress: true,

  // 配置生成源映射（开发环境）
  productionBrowserSourceMaps: false,

}

module.exports = nextConfig
