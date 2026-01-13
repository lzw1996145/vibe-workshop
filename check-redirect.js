const http = require('http');

console.log('=== 测试重定向流程 ===\n');

// 测试1: 直接访问 /post/AT2402
console.log('测试1: GET http://localhost:3003/post/AT2402');
http.get('http://localhost:3003/post/AT2402', (res) => {
  console.log('  状态码:', res.statusCode);
  console.log('  Location:', res.headers.location);
  console.log('  Content-Type:', res.headers['content-type']);
  console.log('');
  
  // 测试2: 访问重定向后的 URL
  if (res.headers.location) {
    const redirectUrl = res.headers.location;
    console.log('测试2: GET ' + redirectUrl);
    http.get(redirectUrl, (res2) => {
      console.log('  状态码:', res2.statusCode);
      console.log('  Content-Type:', res2.headers['content-type']);
      console.log('');
      
      // 读取前100字节
      res2.setEncoding('utf8');
      let data = '';
      res2.on('data', chunk => {
        data += chunk;
        if (data.length > 100) {
          res2.destroy();
          console.log('  页面内容（前100字符）:');
          console.log('    ' + data.substring(0, 100));
        }
      });
    });
  }
}).on('error', e => {
  console.error('错误:', e.message);
});
