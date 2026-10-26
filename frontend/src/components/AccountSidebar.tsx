import { Link, useLocation } from "react-router-dom";
import { UserIcon, ClipboardDocumentListIcon, CreditCardIcon, HeartIcon, BellIcon, ChatBubbleLeftRightIcon, TrophyIcon, Cog6ToothIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const groups = [
  {
    title: "Tài khoản của tôi",
    items: [
      { href: "/account", label: "Hồ sơ & bảo mật", Icon: UserIcon },
      { href: "/account/settings", label: "Cài đặt", Icon: Cog6ToothIcon },
    ],
  },
  {
    title: "Hoạt động du lịch",
    items: [
      { href: "/account/bookings", label: "Tour đã đặt", Icon: ClipboardDocumentListIcon },
      { href: "/account/payments", label: "Thanh toán & hóa đơn", Icon: CreditCardIcon },
    ],
  },
  {
    title: "Cá nhân hóa",
    items: [
      { href: "/account/wishlist", label: "Yêu thích", Icon: HeartIcon },
    ],
  },
  {
    title: "Tương tác",
    items: [
      { href: "/account/reviews", label: "Đánh giá & hỗ trợ", Icon: ChatBubbleLeftRightIcon },
      { href: "/account/notifications", label: "Thông báo", Icon: BellIcon },
    ],
  },
  {
    title: "Thành viên & điểm thưởng",
    items: [
      { href: "/account/loyalty", label: "Thành viên", Icon: TrophyIcon },
    ],
  },
];

export default function AccountSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="rounded-3xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 shadow-sm">
      <nav className="space-y-5">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {group.title}
            </div>
            <div className="grid gap-1">
              {group.items.map(({ href, label, Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    to={href}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all duration-150 text-xs sm:text-sm font-semibold ${
                      active
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600 font-bold shadow-sm"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
                    <span>{label}</span>
                    {label === "Tour đã đặt" && (
                      <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        1
                      </span>
                    )}
                    {label === "Yêu thích" && (
                      <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        5
                      </span>
                    )}
                    {label === "Thành viên" && (
                      <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        👑 VIP
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}


