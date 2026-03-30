import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function AdminHeader({ isSidebarOpen, setIsSidebarOpen }) {
  const { auth } = usePage().props;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = auth.user;

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors h-20">
        <div className="h-full px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">
                {isSidebarOpen ? 'menu_open' : 'menu'}
              </span>
            </button>

            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <img src={isDarkMode ? "/img/logo_dark.png" : "/img/logo.png"} alt="KalaStudio Logo" className="h-8 rounded-lg" />
              <span className="hidden md:block text-xs font-black bg-red-500 text-white px-2 py-0.5 rounded-md uppercase tracking-widest">Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-2xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-2 p-1.5 rounded-2xl border transition-all ${isProfileOpen ? 'bg-slate-50 dark:bg-slate-800 border-primary/20' : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <div className="w-8 h-8 md:w-9 md:h-9 bg-red-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-red-500/20 shrink-0">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'AD'}
                </div>
                <div className="hidden md:block text-left ml-1 mr-1">
                  <p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">
                    {user?.name}
                  </p>
                  <p className="text-[9px] font-black text-red-500 uppercase leading-none tracking-[0.2em]">
                    Platform Admin
                  </p>
                </div>
                <span className="hidden md:block material-symbols-outlined text-slate-400">expand_more</span>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-4 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-20">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-black text-slate-900 dark:text-white mb-1">{user?.name}</p>
                      <p className="text-sm text-slate-500 truncate lowercase">{user?.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-bold group"
                      >
                        <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">logout</span>
                        Keluar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
