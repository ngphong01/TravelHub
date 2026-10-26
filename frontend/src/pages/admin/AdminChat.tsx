import ChatAdminManager from '../../components/ChatAdminManager';

export default function AdminChat() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Chat & Tư vấn</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Theo dõi và kiểm soát toàn bộ hội thoại tư vấn viên và khách hàng
          </p>
        </div>
      </div>
      <ChatAdminManager />
    </div>
  );
}
