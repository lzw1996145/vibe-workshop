const http = require('http');

console.log('=== 完整页面测试 ===\n');

const options = {
  hostname: 'localhost',
  port: 3003,
  path: '/post/AT2402/',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'text/html'
  }
};

const req = http.request(options, (res) => {
  console.log('状态码:', res.statusCode);
  console.log('状态信息:', res.statusMessage);
  console.log('Content-Type:', res.headers['content-type']);
  console.log('Content-Length:', res.headers['content-length']);
  console.log('');
  
  let data = '';
  res.setEncoding('utf8');
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    // 提取标题
    const titleMatch = data.match(/<title>([^<]*)<\/title>/);
    if (titleMatch) {
      console.log('页面标题:', titleMatch[1]);
    } else {
      console.log('未找到标题');
    }
    
    // 检查是否是错误页面
    if (data.includes('文章未找到') || data.includes('404')) {
      console.log('⚠️  这是一个404页面！');
    } else if (data.includes('AT2402') || data.includes('非易失性')) {
      console.log('✅ 页面内容正确！');
    } else {
      console.log('❓ 页面内容不确定');
    }
  });
});

req.on('error', (e) => {
  console.error('错误:', e.message);
});

req.end();
