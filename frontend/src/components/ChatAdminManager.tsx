import { useState, useEffect, useMemo } from "react";
import { getAuthHeaders } from "../utils/fetchHelpers";
import { 
  TrashIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ClockIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  userId: string | null;
  user: {
    name: string | null;
    email: string;
  } | null;
  createdAt: string;
}

export default function ChatAdminManager() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const cannedResponses = [
    "Dạ TravelHub xin chào anh/chị! Em có thể tư vấn hành trình hoặc kiểm tra tình trạng chỗ tour nào giúp mình ạ?",
    "Dạ quý khách có thể áp dụng mã giảm giá TRAVEL50K để nhận chiết khấu trực tiếp khi thanh toán ạ!",
    "Dạ các tour tại TravelHub đều bao gồm bảo hiểm du lịch trọn gói và hỗ trợ đổi ngày miễn phí trước 7 ngày ạ.",
    "Dạ em đã ghi nhận yêu cầu, chuyên viên điều hành tour sẽ liên hệ lại với anh/chị trong ít phút ạ!"
  ];

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/chat", {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      const msgs = data.messages || [];
      setMessages(msgs);
      if (msgs.length > 0 && !selectedMessage) {
        setSelectedMessage(msgs[0]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hội thoại này khỏi hệ thống?")) return;

    try {
      const response = await fetch(`/api/admin/chat/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== id));
        if (selectedMessage?.id === id) {
          const remaining = messages.filter(msg => msg.id !== id);
          setSelectedMessage(remaining[0] || null);
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyCanned = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(text);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const filteredMessages = useMemo(() => {
    return messages.filter(message => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        message.message.toLowerCase().includes(q) ||
        message.response.toLowerCase().includes(q) ||
        (message.user?.email && message.user.email.toLowerCase().includes(q)) ||
        (message.user?.name && message.user.name.toLowerCase().includes(q));
      
      if (!matchesSearch) return false;

      const messageDate = new Date(message.createdAt);
      const now = new Date();

      switch (filter) {
        case "today":
          return messageDate.toDateString() === now.toDateString();
        case "week": {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return messageDate >= weekAgo;
        }
        case "month": {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return messageDate >= monthAgo;
        }
        default:
          return true;
      }
    });
  }, [messages, searchTerm, filter]);

  // Keep selected message in sync if list updates
  useEffect(() => {
    if (filteredMessages.length > 0 && (!selectedMessage || !filteredMessages.find(m => m.id === selectedMessage.id))) {
      setSelectedMessage(filteredMessages[0]);
    } else if (filteredMessages.length === 0) {
      setSelectedMessage(null);
    }
  }, [filteredMessages]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return messages.filter(m => new Date(m.createdAt).toDateString() === today).length;
  }, [messages]);

  const uniqueUsersCount = useMemo(() => {
    const emails = new Set(messages.map(m => m.user?.email || m.userId || 'guest'));
    return emails.size;
  }, [messages]);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{messages.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tổng số hội thoại</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ClockIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{todayCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tin nhắn hôm nay</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <UserCircleIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{uniqueUsersCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Khách hàng liên hệ</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span>100%</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tỷ lệ AI phản hồi tức thì</div>
          </div>
        </div>
      </div>

      {/* Main Master-Detail Console Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[640px]">
        {/* Left Side: Conversation List (Master) */}
        <div className="lg:w-2/5 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
          {/* Header & Controls */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <span>Hộp thư tư vấn</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                  {filteredMessages.length}
                </span>
              </h3>
              <button
                onClick={fetchMessages}
                disabled={loading}
                className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all disabled:opacity-50"
                title="Làm mới"
              >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo email, nội dung hỏi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilter("today")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filter === "today"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                }`}
              >
                Hôm nay
              </button>
              <button
                onClick={() => setFilter("week")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filter === "week"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                }`}
              >
                Tuần này
              </button>
              <button
                onClick={() => setFilter("month")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filter === "month"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                }`}
              >
                Tháng này
              </button>
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[560px]">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto" />
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Đang tải lịch sử hội thoại...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-10 text-center text-slate-400">
                <ChatBubbleLeftRightIcon className="h-10 w-10 mx-auto opacity-30 mb-2" />
                <p className="text-sm font-medium">Không tìm thấy tin nhắn nào</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                const authorInitial = (msg.user?.name || msg.user?.email || "K").charAt(0).toUpperCase();

                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/80 dark:bg-blue-950/30 border-l-4 border-blue-600"
                        : "hover:bg-white dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                        {authorInitial}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {msg.user?.name || msg.user?.email || "Khách ẩn danh"}
                          </span>
                          <span className="text-[11px] text-slate-400 whitespace-nowrap ml-2">
                            {formatDate(msg.createdAt).split(" ")[1]}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mb-1 font-medium">
                          {msg.message}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircleIcon className="h-3 w-3" />
                            Đã phản hồi
                          </span>
                          <span>{new Date(msg.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Conversation Viewer & Response Assistant (Detail) */}
        <div className="lg:w-3/5 flex flex-col bg-white dark:bg-slate-900">
          {selectedMessage ? (
            <>
              {/* Detail Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md shadow-blue-500/20">
                    {(selectedMessage.user?.name || selectedMessage.user?.email || "K").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {selectedMessage.user?.name || selectedMessage.user?.email || "Khách vãng lai"}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      {selectedMessage.user?.email && (
                        <span className="flex items-center gap-1">
                          <EnvelopeIcon className="h-3.5 w-3.5" />
                          {selectedMessage.user.email}
                        </span>
                      )}
                      <span>•</span>
                      <span>Gửi lúc: {formatDate(selectedMessage.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyText(`Khách hỏi: ${selectedMessage.message}\nTrả lời: ${selectedMessage.response}`, selectedMessage.id)}
                    className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    title="Sao chép nội dung hội thoại"
                  >
                    {copiedId === selectedMessage.id ? (
                      <CheckIcon className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                    title="Xóa tin nhắn này"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Chat Thread Messages Stream */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
                {/* User Message Bubble */}
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-1">
                    {(selectedMessage.user?.name || selectedMessage.user?.email || "K").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
                      {selectedMessage.user?.name || "Khách hàng"}
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-200/80 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>

                {/* Assistant / Support Response Bubble */}
                <div className="flex items-start gap-3 max-w-[88%] ml-auto flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    AI
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-teal-600 dark:text-teal-400 mb-1 font-semibold flex items-center gap-1 justify-end">
                      <SparklesIcon className="h-3 w-3" />
                      <span>TravelHub AI Assistant</span>
                    </div>
                    <div className="bg-gradient-to-br from-teal-600 to-emerald-700 p-4 rounded-2xl rounded-tr-none shadow-md text-sm text-white leading-relaxed text-left whitespace-pre-wrap">
                      {selectedMessage.response || (
                        <span className="italic opacity-80">Không có phản hồi được lưu.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Canned Quick Responses Bar */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <PaperAirplaneIcon className="h-3.5 w-3.5 text-blue-500" />
                    Câu trả lời mẫu nhanh (Nhấn để sao chép):
                  </span>
                  {copiedPrompt && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                      Đã sao chép vào bộ nhớ tạm!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cannedResponses.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => copyCanned(item)}
                      className="text-left text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-slate-700 dark:text-slate-300 transition-all line-clamp-2"
                    >
                      "{item}"
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-slate-400" />
              </div>
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-1">
                Chọn một hội thoại để xem chi tiết
              </h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Bạn có thể kiểm tra nội dung câu hỏi của khách hàng, phản hồi của AI và sao chép câu trả lời mẫu hỗ trợ.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

