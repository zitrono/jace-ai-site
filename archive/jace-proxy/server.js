const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8081;

// Proxy all requests to jace.ai
app.use('/', createProxyMiddleware({
  target: 'https://jace.ai',
  changeOrigin: true,
  secure: true,
  onProxyReq: (proxyReq, req, res) => {
    // Remove any headers that might interfere
    proxyReq.removeHeader('x-forwarded-for');
    proxyReq.removeHeader('x-forwarded-proto');
    proxyReq.removeHeader('x-forwarded-host');
  },
  onProxyRes: (proxyRes, req, res) => {
    // Allow all origins for local testing
    proxyRes.headers['access-control-allow-origin'] = '*';
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
  console.log(`Proxying all requests to https://jace.ai`);
});