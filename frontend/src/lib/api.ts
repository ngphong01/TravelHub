// src/lib/api.ts
import axios from 'axios';

// API Base URL - use environment variable or fallback to relative path (for proxy)
const configuredApiUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || '';
const isLocalBackend = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(configuredApiUrl);
// The development server proxies /api. An absolute localhost URL creates cross-origin
// requests when the page is opened through 127.0.0.1 and fails for remote visitors.
const API_BASE_URL = isLocalBackend ? '' : configuredApiUrl.replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : '/api',
});

// 🔥 CRITICAL: Lưu current language để interceptor có thể đọc ngay lập tức
let currentLanguage = 'vi';

// Lắng nghe languageChanged event để update currentLanguage ngay lập tức
if (typeof window !== 'undefined') {
  // Load initial language
  currentLanguage = localStorage.getItem('travelgo:language') || 
                    localStorage.getItem('language') || 
                    'vi';
  
  // Listen for language changes
  window.addEventListener('languageChanged', ((event: CustomEvent) => {
    currentLanguage = event.detail || 'vi';
  }) as EventListener);
}

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('tg_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // 🔥 CRITICAL: Tự động thêm lang parameter vào tất cả API calls
  // Đọc từ biến currentLanguage (được update ngay lập tức khi language thay đổi)
  const lang = currentLanguage || 
               localStorage.getItem('travelgo:language') || 
               localStorage.getItem('language') || 
               'vi';
  
  // Thêm lang vào query params (không override nếu đã có)
  if (config.params) {
    config.params.lang = config.params.lang || lang;
  } else {
    config.params = { lang };
  }
  
  console.log('📤 API Request:', config.method?.toUpperCase(), config.url, config.params, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.config.method?.toUpperCase(), response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
