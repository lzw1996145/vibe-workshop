const { getPostBySlug, getAllPosts } = require('./lib/posts.ts');

console.log('=== 测试 Slug 匹配 ===\n');

// 获取所有文章
const posts = getAllPosts();
console.log(`总文章数: ${posts.length}\n`);

// 测试每个 slug
posts.forEach((post, index) => {
  const foundPost = getPostBySlug(post.slug);
  
  if (foundPost) {
    console.log(`✅ ${index + 1}. ${post.slug}`);
    console.log(`   标题: ${foundPost.title}`);
    console.log(`   文件匹配: 成功`);
  } else {
    console.log(`❌ ${index + 1}. ${post.slug}`);
    console.log(`   错误: 文件未找到`);
  }
  console.log('');
});

// 测试 URL 编码场景
console.log('=== 测试 URL 编码场景 ===\n');

const testCases = [
  { slug: 'STM32-1', encoded: 'STM32-1' },
  { slug: 'LED-Key和LCD', encoded: 'LED-Key%E5%92%8CLCD' },
  { slug: '程序框架与调度器', encoded: '%E7%A8%8B%E5%BA%8F%E6%A1%86%E6%9E%B6%E4%B8%8E%E8%B0%83%E5%BA%A6%E5%99%A8' }
];

testCases.forEach(({ slug, encoded }) => {
  const post1 = getPostBySlug(slug);
  const post2 = getPostBySlug(decodeURIComponent(encoded));
  
  console.log(`原始 slug: ${slug}`);
  console.log(`  直接匹配: ${post1 ? '✅' : '❌'}`);
  console.log(`  解码后匹配: ${post2 ? '✅' : '❌'}`);
  console.log('');
});
