import { Link, usePage } from '@inertiajs/react';

export default function AdminSidebar({ isSidebarOpen }) {
  const { url } = usePage();
  const currentPath = url;

  const menuItems = [
    { name: 'Dashboard', icon: 'admin_panel_settings', to: '/admin/dashboard' },
    { name: 'Manajemen User', icon: 'manage_accounts', to: '/admin/users' },
    { name: 'Log Viewer', icon: 'terminal', to: '/log-viewer' },
  ];

  return (
    <aside
      className={`
        fixed lg:sticky top-20 bottom-0 left-0 z-40 
        bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 
        transition-all duration-300 ease-in-out overflow-hidden
        ${isSidebarOpen
          ? 'w-64 translate-x-0 opacity-100'
          : 'w-0 lg:w-0 -translate-x-full lg:translate-x-0 lg:opacity-0 opacity-0'}
      `}
    >
      <div className="w-64">
        <div className="p-6 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Menu Administrator</p>
          {menuItems.map((item, i) => {
            const isActive = currentPath === item.to;
            const Tag = item.to === '/log-viewer' ? 'a' : Link;
            return (
              <Tag
                key={i}
                href={item.to}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500'}`}
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
