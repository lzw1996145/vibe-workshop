// 简单的HTTP测试
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/post/AT2402',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log('状态码:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  console.log('');
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(chunk.substring(0, 200));
  });
});

req.on('error', (e) => {
  console.error('错误:', e.message);
});

req.end();
