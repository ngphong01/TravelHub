const { createProxyMiddleware } = require('http-proxy-middleware');

// Track error counts to avoid spam
const errorCounts = new Map();
const MAX_ERROR_LOGS = 5; // Only log first 5 errors per endpoint

function sendProxyError(err, req, res) {
  if (!res || res.headersSent || res.writableEnded || res.destroyed) return;
  // WebSocket proxy errors provide a raw socket, not a ServerResponse.
  if (typeof res.writeHead !== 'function') {
    if (typeof res.destroy === 'function') res.destroy();
    return;
  }
  res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ message: 'Không kết nối được máy chủ TravelHub. Vui lòng thử lại.', code: err.code || 'PROXY_ERROR' }));
}

module.exports = function(app) {
  // Proxy API requests
  // Use REACT_APP_BACKEND_URL if set (for Dev Tunnels), otherwise use 127.0.0.1 (IPv4)
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:3000';
  console.log('🔗 Frontend proxy target:', backendUrl);
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      secure: backendUrl.startsWith('https'), // Use secure for HTTPS URLs
      logLevel: 'silent', // Completely silent - we handle errors ourselves
      timeout: 30000, // Increased timeout
      proxyTimeout: 30000,
      ws: true, // Enable websocket support
      xfwd: true,
      // Suppress all default error logging
      onProxyError: sendProxyError,
      onProxyReq: (proxyReq, req, res) => {
        // Only log important requests, not every one
        if (req.url.includes('/auth/user') || req.url.includes('/destination/featured')) {
          // Suppress frequent polling requests
          return;
        }
      },
      onError: (err, req, res) => {
        // Completely suppress ECONNRESET errors - they're just noise
        // These happen when connections are closed prematurely but don't indicate real problems
        if (err.code === 'ECONNRESET') return sendProxyError(err, req, res);
        
        const errorKey = `${req.method}:${req.url}`;
        const count = errorCounts.get(errorKey) || 0;
        
        // Only log first few errors to avoid spam
        if (count < MAX_ERROR_LOGS) {
          if (err.code === 'ECONNREFUSED') {
            // Backend is down or not responding
            if (count === 0) {
              console.warn(`[PROXY] Backend không khả dụng (${err.code}). Đảm bảo backend đang chạy trên port 3000.`);
            }
          } else if (err.code !== 'ECONNRESET') {
            // Only log non-ECONNRESET errors
            console.error(`[PROXY ERROR] ${err.code}: ${err.message}`);
          }
          errorCounts.set(errorKey, count + 1);
        }
        
        // Check if res is a valid Express response object before using it
        sendProxyError(err, req, res);
      },
      onProxyRes: (proxyRes, req, res) => {
        // Reset error count on success
        const errorKey = `${req.method}:${req.url}`;
        if (errorCounts.has(errorKey)) {
          errorCounts.delete(errorKey);
        }
      }
    })
  );

  // Proxy uploads folder for images
  app.use(
    '/uploads',
    createProxyMiddleware({
      target: 'http://127.0.0.1:3000', // Backend runs on port 3000 (use IPv4)
      changeOrigin: true,
      secure: false,
      logLevel: 'silent', // Suppress all logging
      timeout: 10000,
      proxyTimeout: 10000,
      onError: (err, req, res) => {
        // Completely suppress ECONNRESET for uploads too
        if (err.code === 'ECONNRESET') return sendProxyError(err, req, res);
        // Suppress upload errors unless critical
        if (err.code !== 'ECONNREFUSED') {
          console.error('[UPLOAD PROXY ERROR]', err.message);
        }
        // Check if res is valid before using it
        sendProxyError(err, req, res);
      }
    })
  );
};

