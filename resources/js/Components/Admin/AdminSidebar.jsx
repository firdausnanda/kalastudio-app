import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AdminSidebar({ isSidebarOpen }) {
  const { url } = usePage();
  const currentPath = url;

  // State for Blog dropdown
  const [isBlogOpen, setIsBlogOpen] = useState(currentPath.startsWith('/admin/blog-'));

  const menuItems = [
    { name: 'Dashboard', icon: 'admin_panel_settings', to: '/admin/dashboard' },
    { name: 'Manajemen User', icon: 'manage_accounts', to: '/admin/users' },
    { name: 'Broadcast', icon: 'campaign', to: '/admin/broadcasts' },
    { name: 'Pembayaran', icon: 'payments', to: '/admin/payments' },
    { name: 'Pesan Masuk', icon: 'mail', to: '/admin/contacts' },
    {
      name: 'Blogs',
      icon: 'library_books',
      isDropdown: true,
      isOpen: isBlogOpen,
      toggle: () => setIsBlogOpen(!isBlogOpen),
      subItems: [
        { name: 'Artikel Blog', to: '/admin/blog-posts' },
        { name: 'Kategori Blog', to: '/admin/blog-categories' },
        { name: 'Tag Blog', to: '/admin/blog-tags' },
      ]
    },
    { name: 'Activity Log', icon: 'history', to: '/admin/activity-logs' },
    { name: 'Log Viewer', icon: 'terminal', to: '/log-viewer' },
  ];

  return (
    <aside
      className={`
        fixed lg:sticky top-20 bottom-0 left-0 z-40 
        bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 
        transition-all duration-300 ease-in-out overflow-hidden overflow-y-auto custom-scrollbar
        ${isSidebarOpen
          ? 'w-64 translate-x-0 opacity-100'
          : 'w-0 lg:w-0 -translate-x-full lg:translate-x-0 lg:opacity-0 opacity-0'}
      `}
    >
      <div className="w-64 min-h-max pb-20">
        <div className="p-6 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Menu Administrator</p>

          {menuItems.map((item, i) => {
            if (item.isDropdown) {
              const isChildActive = item.subItems.some(sub => currentPath.startsWith(sub.to));

              return (
                <div key={i} className="mb-2">
                  <button
                    onClick={item.toggle}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${isChildActive && !item.isOpen
                        ? 'bg-red-50 text-red-500 dark:bg-red-500/10'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined">{item.icon}</span>
                      {item.name}
                    </div>
                    <span className={`material-symbols-outlined transition-transform duration-300 ${item.isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>

                  {/* Dropdown Content */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${item.isOpen ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col gap-1 pl-12 pr-4 py-2 relative">
                      {/* Vertical connector line */}
                      <div className="absolute left-[26px] top-0 bottom-4 w-px bg-slate-200 dark:bg-slate-700"></div>

                      {item.subItems.map((sub, j) => {
                        const isSubActive = currentPath.startsWith(sub.to);
                        return (
                          <div key={j} className="relative">
                            {/* Horizontal connector line */}
                            <div className="absolute left-[-26px] top-1/2 w-4 h-px bg-slate-200 dark:bg-slate-700 -translate-y-1/2"></div>
                            <Link
                              href={sub.to}
                              className={`block w-full px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${isSubActive
                                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                                  : 'text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                              {sub.name}
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            // Normal Menu Item
            const isActive = currentPath === item.to;
            const Tag = item.to === '/log-viewer' ? 'a' : Link;
            return (
              <Tag
                key={i}
                href={item.to}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all mb-2 ${isActive
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500'
                  }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.name}
              </Tag>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
