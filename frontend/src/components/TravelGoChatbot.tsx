import { useState, useRef, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useSimpleAuth } from '../lib/use-simple-auth';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export default function TravelGoChatbot() {
  const { data: authData } = useSimpleAuth() as any;
  const user = authData?.user || null;
  
  // Bot info
  const botName = 'Tư vấn viên TravelHub';
  const botAvatar = '/uploads/avatars/support-avatar.png';
  
  // User info
  const userName = user?.name || user?.email?.split('@')[0] || 'Khách';
  const userInitial = userName.charAt(0).toUpperCase();
  
  // Lấy avatar từ nhiều nguồn có thể
  const getUserAvatarUrl = () => {
    const avatar = user?.avatarUrl || user?.picture || user?.image || null;
    
    if (!avatar) return null; // Return null để hiển thị fallback với initial
    
    if (avatar.startsWith('http')) return avatar;
    if (avatar.startsWith('/uploads')) return avatar;
    if (avatar.startsWith('/')) return avatar;
    return `/uploads/avatars/${avatar}`;
  };
  
  const userAvatarUrl = getUserAvatarUrl();

  const [isOpen, setIsOpen] = useState(false);
  const aiProvider = 'gemini';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Xin chào! Tôi là ${botName}. Tôi luôn sẵn sàng hỗ trợ quý khách thông tin tour, lịch trình, kiểm tra tình trạng đặt chỗ, voucher hoặc hướng dẫn thanh toán. Quý khách cần hỗ trợ gì ạ?`,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      text: 'Đang kết nối & phản hồi...',
      isUser: false,
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const token = localStorage.getItem('tg_token');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ 
          message: userMessage.text,
          provider: aiProvider // Gửi provider đã chọn
        }),
      });

      const data = await response.json();

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      if (response.ok) {
        // Backend trả về 'response' chứ không phải 'reply'
        const aiResponse = data.response || data.reply || data.message;
        
        if (aiResponse && aiResponse !== userMessage.text) {
          // Chỉ hiển thị nếu không phải là tin nhắn của user (tránh nhại lại)
          const aiMessage: Message = {
            id: Date.now().toString(),
            text: aiResponse,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          // Nếu không có response hợp lệ, hiển thị lỗi
          const errorMessage: Message = {
            id: Date.now().toString(),
            text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.',
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } else {
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: data.message || 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Xin lỗi, không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const clearChat = async () => {
    try {
      const token = localStorage.getItem('tg_token');
      if (token) {
        await fetch('/api/chat/history', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setMessages([
        {
          id: '1',
          text: `Xin chào! Tôi là ${botName}. Tôi luôn sẵn sàng hỗ trợ quý khách thông tin tour, lịch trình, kiểm tra tình trạng đặt chỗ, voucher hoặc hướng dẫn thanh toán. Quý khách cần hỗ trợ gì ạ?`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Mở chatbot"
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 bg-emerald-500 border-2 border-white rounded-full w-3 h-3" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-96 h-[min(600px,calc(100vh-7rem))] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={botAvatar}
            alt={botName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
            onError={(e) => {
              // Fallback logo TravelHub
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzI1NjNFQiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTQlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0Ij5USDwvdGV4dD48L3N2Zz4=';
            }}
          />
          <div>
            <h3 className="font-bold text-lg">{botName}</h3>
            <p className="text-xs text-blue-100">Hỗ trợ trực tuyến 24/7</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Xóa lịch sử chat"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Đóng chatbot"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={messagesEndRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {message.isUser ? (
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-500 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  {userAvatarUrl ? (
                    <img
                      src={userAvatarUrl}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Nếu ảnh lỗi, hiển thị initial
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                        const parent = img.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-white font-bold text-sm">${userInitial}</span>`;
                        }
                      }}
                    />
                  ) : (
                    // Hiển thị initial nếu không có avatar
                    <span className="text-white font-bold text-sm">{userInitial}</span>
                  )}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <img
                    src={botAvatar}
                    alt={botName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback icon nếu không có avatar
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L13.09 8.26L20 9L13.09 15.74L12 22L10.91 15.74L4 9L10.91 8.26L12 2Z"/></svg>';
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
              {/* Name */}
              <span className={`text-xs font-semibold mb-1 px-2 ${message.isUser ? 'text-blue-600' : 'text-indigo-600'}`}>
                {message.isUser ? userName : botName}
              </span>
              
              {/* Message Bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.isUser
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'bg-white text-gray-800 shadow-md border border-gray-200'
                } ${message.isTyping ? 'animate-pulse' : ''}`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                {message.isTyping && (
                  <div className="flex gap-1 mt-2">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${message.isUser ? 'bg-white/70' : 'bg-gray-400'}`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${message.isUser ? 'bg-white/70' : 'bg-gray-400'}`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${message.isUser ? 'bg-white/70' : 'bg-gray-400'}`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi du lịch..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputText.trim()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[44px]"
            aria-label="Gửi tin nhắn"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Trợ lý AI TravelHub hỗ trợ thông tin điểm đến và đặt chỗ 24/7.
        </p>
      </div>
    </div>
  );
}

