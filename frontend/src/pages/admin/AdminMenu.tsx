import { useState } from 'react';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  Bars3Icon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import SEOHead from '../../components/SEOHead';

interface MenuItem {
  id: string;
  title: string;
  href: string;
  location: 'header' | 'footer';
  order: number;
  active: boolean;
  category?: string;
}

const DEFAULT_MENUS: MenuItem[] = [
  { id: '1', title: 'Trang chủ', href: '/', location: 'header', order: 1, active: true },
  { id: '2', title: 'Tour Du Lịch', href: '/tours', location: 'header', order: 2, active: true },
  { id: '3', title: 'Điểm Đến', href: '/destinations', location: 'header', order: 3, active: true },
  { id: '4', title: 'Khách Sạn', href: '/hotels', location: 'header', order: 4, active: true },
  { id: '5', title: 'Nhà Hàng', href: '/restaurants', location: 'header', order: 5, active: true },
  { id: '6', title: 'Ưu Đãi & Voucher', href: '/promo-codes', location: 'header', order: 6, active: true },
  { id: '7', title: 'Câu Chuyện Du Lịch', href: '/featured-stories', location: 'header', order: 7, active: true },
  { id: '8', title: 'Lập Kế Hoạch', href: '/planner', location: 'header', order: 8, active: true },
  { id: '9', title: 'Về TravelHub', href: '/about', location: 'footer', order: 1, active: true, category: 'Công ty' },
  { id: '10', title: 'Hình thức thanh toán', href: '/payment-methods', location: 'footer', order: 2, active: true, category: 'Hỗ trợ' },
  { id: '11', title: 'Giải đáp thắc mắc (FAQ)', href: '/faq', location: 'footer', order: 3, active: true, category: 'Hỗ trợ' },
  { id: '12', title: 'Trợ lý ảo AI', href: '/chatbot', location: 'footer', order: 4, active: true, category: 'Tiện ích' },
  { id: '13', title: 'Liên hệ', href: '/contact', location: 'footer', order: 5, active: true, category: 'Công ty' },
];

export default function AdminMenu() {
  const [menus, setMenus] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('travelhub:admin_menus');
    return saved ? JSON.parse(saved) : DEFAULT_MENUS;
  });
  const [activeTab, setActiveTab] = useState<'all' | 'header' | 'footer'>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    title: '',
    href: '',
    location: 'header',
    order: 1,
    active: true
  });

  const saveToStorage = (updated: MenuItem[]) => {
    setMenus(updated);
    localStorage.setItem('travelhub:admin_menus', JSON.stringify(updated));
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      href: '',
      location: activeTab === 'all' ? 'header' : activeTab,
      order: menus.length + 1,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa menu item này?')) {
      const updated = menus.filter(m => m.id !== id);
      saveToStorage(updated);
    }
  };

  const handleToggleActive = (id: string) => {
    const updated = menus.map(m => m.id === id ? { ...m, active: !m.active } : m);
    saveToStorage(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.href) return;

    if (editingItem) {
      const updated = menus.map(m => m.id === editingItem.id ? { ...m, ...formData } as MenuItem : m);
      saveToStorage(updated);
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        title: formData.title || '',
        href: formData.href || '',
        location: (formData.location as 'header' | 'footer') || 'header',
        order: Number(formData.order) || menus.length + 1,
        active: formData.active ?? true
      };
      saveToStorage([...menus, newItem]);
    }
    setIsModalOpen(false);
  };

  const filteredMenus = menus.filter(m => {
    if (activeTab === 'header') return m.location === 'header';
    if (activeTab === 'footer') return m.location === 'footer';
    return true;
  }).sort((a, b) => a.order - b.order);

  return (
    <>
      <SEOHead
        title="Quản Lý Menu & Điều Hướng - TravelHub Admin"
        description="Bảng điều khiển quản lý cấu trúc Menu Header và Footer cho nền tảng TravelHub."
        url="/admin/menu"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Bars3Icon className="h-7 w-7 text-blue-600" />
              <span>Quản Lý Menu & Điều Hướng</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tùy chỉnh hệ thống liên kết điều hướng trên thanh Navbar chính và Footer
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/25 transition-all"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Thêm Menu Item</span>
          </button>
        </div>

        {/* Tab Controls & Metrics */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Tất cả ({menus.length})
            </button>
            <button
              onClick={() => setActiveTab('header')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'header'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Header Menu ({menus.filter(m => m.location === 'header').length})
            </button>
            <button
              onClick={() => setActiveTab('footer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'footer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Footer Links ({menus.filter(m => m.location === 'footer').length})
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Tổng cộng: <strong className="text-slate-900 dark:text-white">{filteredMenus.length}</strong> liên kết đang quản lý
          </div>
        </div>

        {/* Menu Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Thứ tự</th>
                  <th className="py-4 px-6">Tên Menu</th>
                  <th className="py-4 px-6">Đường Dẫn (URL)</th>
                  <th className="py-4 px-6">Vị Trí</th>
                  <th className="py-4 px-6">Trạng Thái</th>
                  <th className="py-4 px-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredMenus.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-500 font-bold text-xs">
                      #{item.order}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <span>{item.href}</span>
                      <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 opacity-60" />
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.location === 'header'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                      }`}>
                        {item.location === 'header' ? 'Header Navbar' : 'Footer'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          item.active
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {item.active ? (
                          <>
                            <CheckCircleIcon className="h-3.5 w-3.5" />
                            <span>Hiển thị</span>
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-3.5 w-3.5" />
                            <span>Ẩn</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          title="Chỉnh sửa"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                          title="Xóa menu"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {editingItem ? 'Chỉnh sửa Menu Item' : 'Thêm Menu Item Mới'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Tiêu đề hiển thị:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VD: Cẩm nang du lịch"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Đường dẫn (URL):
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.href}
                    onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                    placeholder="VD: /travel-guide hoặc https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Vị trí:
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value as 'header' | 'footer' })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="header">Header Navbar</option>
                      <option value="footer">Footer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Thứ tự hiển thị:
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="menuActive"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <label htmlFor="menuActive" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Kích hoạt hiển thị công khai
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
                  >
                    {editingItem ? 'Lưu thay đổi' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
