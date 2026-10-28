import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  QuestionMarkCircleIcon, 
  MagnifyingGlassIcon, 
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
  PhoneArrowUpRightIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import SEOHead from '../components/SEOHead';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'b1',
    category: 'booking',
    question: 'Tôi có thể đặt tour trước bao nhiêu ngày?',
    answer: 'Bạn có thể đặt tour từ 2 ngày đến 6 tháng trước ngày khởi hành. Với các dịp Lễ, Tết hoặc mùa cao điểm, chúng tôi khuyến khích đặt trước tối thiểu 2-4 tuần để đảm bảo giữ chỗ tốt nhất và nhận mức giá ưu đãi.'
  },
  {
    id: 'b2',
    category: 'booking',
    question: 'Sau khi đặt tour thành công, tôi sẽ nhận vé và lịch trình như thế nào?',
    answer: 'Bạn có thể theo dõi mã và trạng thái đơn trong tài khoản. Vé hoặc tài liệu hành trình, nếu áp dụng, sẽ được cung cấp sau khi dịch vụ được xác nhận.'
  },
  {
    id: 'b3',
    category: 'booking',
    question: 'Giá tour đã bao gồm những chi phí gì?',
    answer: 'Dịch vụ bao gồm phụ thuộc vào từng tour. Hãy xem lịch trình và mục dịch vụ bao gồm trên trang chi tiết; nếu chưa được công bố, vui lòng xác nhận với TravelHub trước khi thanh toán.'
  },
  {
    id: 'p1',
    category: 'payment',
    question: 'TravelHub hỗ trợ những hình thức thanh toán nào?',
    answer: 'Hệ thống hỗ trợ đa dạng phương thức thanh toán bảo mật: Chuyển khoản nhanh tự động qua mã VietQR Napas 24/7, ví điện tử MoMo, ví ZaloPay, thẻ nội địa ATM (VNPAY-QR), thẻ quốc tế Visa / MasterCard / JCB và cổng thanh toán quốc tế PayPal.'
  },
  {
    id: 'p2',
    category: 'payment',
    question: 'Làm thế nào để sử dụng mã giảm giá khi thanh toán?',
    answer: 'Tại trang Thanh toán (Checkout), bạn chỉ cần nhập mã ưu đãi vào ô "Mã khuyến mãi / Voucher" và nhấn "Áp dụng". Số tiền giảm trừ sẽ được cập nhật trực tiếp vào tổng tiền cần thanh toán.'
  },
  {
    id: 'p3',
    category: 'payment',
    question: 'Tôi có được xuất hóa đơn giá trị gia tăng (VAT) không?',
    answer: 'Vui lòng liên hệ TravelHub để xác nhận thông tin xuất hóa đơn, thuế và thời điểm cung cấp hóa đơn trước khi thanh toán.'
  },
  {
    id: 'c1',
    category: 'refund',
    question: 'Chính sách hoàn hủy tour của TravelHub được quy định như thế nào?',
    answer: 'Điều kiện hủy và mức hoàn tiền áp dụng theo chính sách của tour hoặc dịch vụ trong đơn đặt. Hãy xem chính sách trên trang chi tiết và xác nhận trước thanh toán. Nếu chưa có chính sách công bố, vui lòng liên hệ TravelHub để được cung cấp điều kiện bằng văn bản.'
  },
  {
    id: 'c2',
    category: 'refund',
    question: 'Thời gian nhận lại tiền hoàn là bao lâu?',
    answer: 'Thời gian nhận lại tiền phụ thuộc phương thức thanh toán và đơn vị xử lý. TravelHub sẽ thông báo thời hạn cụ thể khi xác nhận yêu cầu hoàn tiền.'
  },
  {
    id: 'd1',
    category: 'documents',
    question: 'Trẻ em đi tour cần mang theo những giấy tờ gì?',
    answer: 'Trẻ em dưới 14 tuổi cần mang theo Giấy khai sinh bản chính hoặc bản sao trích lục có công chứng. Trẻ từ 14 tuổi trở lên bắt buộc phải có Căn cước công dân hoặc Hộ chiếu còn hạn sử dụng.'
  },
  {
    id: 'd2',
    category: 'documents',
    question: 'Đối với tour quốc tế, hộ chiếu cần có thời hạn bao lâu?',
    answer: 'Đối với tất cả các hành trình du lịch quốc tế, hộ chiếu của quý khách phải còn thời hạn tối thiểu 6 tháng tính từ ngày kết thúc chuyến đi và còn ít nhất 2 trang trống.'
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ b1: true, p1: true });

  const categories = [
    { key: 'all', label: 'Tất cả câu hỏi', icon: DocumentTextIcon },
    { key: 'booking', label: 'Đặt tour & Giữ chỗ', icon: CalendarDaysIcon },
    { key: 'payment', label: 'Thanh toán & Hóa đơn', icon: CreditCardIcon },
    { key: 'refund', label: 'Hủy tour & Hoàn tiền', icon: ShieldCheckIcon },
    { key: 'documents', label: 'Giấy tờ & Thủ tục', icon: DocumentTextIcon },
  ];

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch = 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      <SEOHead
        title="Giải Đáp Thắc Mắc & Câu Hỏi Thường Gặp (FAQ) - TravelHub"
        description="Tổng hợp câu hỏi thường gặp về quy trình đặt tour, hình thức thanh toán, hoàn hủy vé và chính sách bảo hiểm du lịch tại TravelHub."
        url="/faq"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#003580] text-white py-10 sm:py-12">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
                backgroundSize: '32px 32px'
              }}
            />
          </div>
          <div className="absolute top-10 left-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 border border-white/20 backdrop-blur-md rounded-full text-teal-200 text-sm font-semibold mb-6 shadow-sm">
              <SparklesIcon className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>Trung Tâm Hỗ Trợ Khách Hàng TravelHub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight text-white">
              Câu hỏi thường gặp
            </h1>
            <p className="text-base text-blue-100 max-w-2xl mx-auto leading-relaxed mb-6">
              Tìm câu trả lời về đặt tour, thanh toán và chuyến đi.
            </p>

            {/* Live Search Input */}
            <div className="relative max-w-2xl mx-auto">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập từ khóa cần hỏi (VD: hoàn tiền, visa, hóa đơn VAT, trẻ em...)"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-sm sm:text-base placeholder-slate-400"
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Accordion FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <QuestionMarkCircleIcon className="h-14 w-14 text-slate-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Không tìm thấy kết quả phù hợp
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
                  Bạn có thể thử tìm kiếm bằng từ khóa khác hoặc liên hệ trực tiếp đội ngũ tư vấn viên để được giải đáp ngay.
                </p>
                <Link
                  to="/contact"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all inline-flex items-center gap-2"
                >
                  <PhoneArrowUpRightIcon className="h-4 w-4" />
                  <span>Gửi thắc mắc cho tư vấn viên</span>
                </Link>
              </div>
            ) : (
              filteredFaqs.map((item) => {
                const isOpen = !!openItems[item.id];
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                        {item.question}
                      </span>
                      <div className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-teal-50 dark:bg-teal-950/40 text-teal-600' : 'text-slate-500'}`}>
                        <ChevronDownIcon className="h-4 w-4" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-6 sm:px-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-4">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Still have questions CTA */}
          <div className="mt-16 bg-gradient-to-br from-teal-700 to-emerald-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black mb-2">Vẫn Chưa Tìm Thấy Câu Trả Lời?</h3>
              <p className="text-teal-100 text-sm max-w-lg leading-relaxed">
                Đội ngũ chăm sóc khách hàng TravelHub và Trợ lý ảo AI hoạt động 24/7 luôn sẵn sàng hỗ trợ bạn bất kỳ lúc nào.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="px-6 py-3 bg-white text-teal-900 hover:bg-teal-50 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <PhoneArrowUpRightIcon className="h-4 w-4" />
                <span>Liên hệ hỗ trợ</span>
              </Link>
              <Link
                to="/chatbot"
                className="px-6 py-3 bg-teal-900/60 hover:bg-teal-900/80 border border-white/20 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                <span>Chat với AI</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
