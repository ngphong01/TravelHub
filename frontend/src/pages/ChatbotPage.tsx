import { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  SparklesIcon, 
  UserIcon, 
  ArrowPathIcon,
  MapPinIcon,
  TagIcon,
  SunIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import SEOHead from '../components/SEOHead';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Xin chào! Em là Trợ lý AI du lịch của TravelHub. Em có thể gợi ý tour, kiểm tra lịch trình, tư vấn khách sạn, ẩm thực địa phương hoặc giải đáp các chính sách đặt vé. Em có thể hỗ trợ gì cho anh/chị hôm nay?',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Gợi ý tour Đà Nẵng - Hội An 3 ngày 2 đêm',
    'Các món ngon đặc sản không thể bỏ qua ở Phú Quốc',
    'Chính sách hoàn tiền khi hủy tour trước 7 ngày',
    'Tour ngắm mùa lúa chín đẹp nhất ở Mù Cang Chải'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setLastFailedPrompt(null);

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: query })
      });

      if (!response.ok) throw new Error(`Chat service returned ${response.status}`);

      const data = await response.json();
      const botReply = data.reply || data.response || 'Xin lỗi, em đang gặp sự cố kết nối. Quý khách vui lòng thử lại sau ít phút hoặc liên hệ hotline 0868156027.';

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setLastFailedPrompt(query);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Dịch vụ tư vấn chưa phản hồi trong 20 giây hoặc đang gián đoạn. Anh/chị có thể thử lại hoặc xem mục Giải đáp thắc mắc (FAQ).',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      window.clearTimeout(timer);
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome_again',
        sender: 'bot',
        text: 'Cuộc trò chuyện đã được làm mới. Em sẵn sàng lắng nghe mọi câu hỏi về chuyến đi tiếp theo của bạn!',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      <SEOHead
        title="Trợ Lý Ảo AI Tư Vấn Du Lịch - TravelHub"
        description="Trò chuyện với AI du lịch TravelHub: tìm kiếm tour thông minh, gợi ý điểm đến, lịch trình và ẩm thực cá nhân hóa 24/7."
        url="/chatbot"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
        {/* Top Header Bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
                <SparklesIcon className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>TravelHub AI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Trợ lý tư vấn du lịch thông minh 24/7
                </p>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              <span>Xóa hội thoại</span>
            </button>
          </div>
        </div>

        {/* Chat Messages Feed Container */}
        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-between">
          <div className="space-y-6 overflow-y-auto mb-6 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3.5 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <UserIcon className="h-4 w-4" />
                  ) : (
                    <SparklesIcon className="h-4 w-4" />
                  )}
                </div>

                <div className={`max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`p-4 sm:p-5 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                        : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 px-1">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <SparklesIcon className="h-4 w-4" />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">TravelHub AI đang suy nghĩ...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          {lastFailedPrompt && !loading && (
            <button type="button" onClick={() => handleSend(lastFailedPrompt)} className="mb-3 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white">Thử gửi lại câu hỏi</button>
          )}
          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
              <SparklesIcon className="h-3.5 w-3.5 text-amber-400" />
              <span>Gợi ý câu hỏi nhanh:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-500 dark:hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-lg p-2 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi về địa điểm, lịch trình tour hoặc thắc mắc..."
              className="flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
