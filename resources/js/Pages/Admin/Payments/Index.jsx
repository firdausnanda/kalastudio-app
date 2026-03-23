import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';

import Select from 'react-select';

export default function PaymentIndex({ transactions, filters }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'ALL');

    const statusOptions = [
        { value: 'ALL', label: 'Semua Status' },
        { value: 'PAID', label: 'PAID' },
        { value: 'PENDING', label: 'PENDING' },
        { value: 'EXPIRED', label: 'EXPIRED' },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleFilter = () => {
        router.get(route('admin.payments.index'), { search, status }, {
            preserveState: true,
            replace: true
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PAID':
                return <span className="px-3 py-1 text-xs font-black bg-emerald-500/10 text-emerald-500 rounded-full">PAID</span>;
            case 'PENDING':
                return <span className="px-3 py-1 text-xs font-black bg-amber-500/10 text-amber-500 rounded-full">PENDING</span>;
            case 'EXPIRED':
                return <span className="px-3 py-1 text-xs font-black bg-rose-500/10 text-rose-500 rounded-full">EXPIRED</span>;
            default:
                return <span className="px-3 py-1 text-xs font-black bg-slate-500/10 text-slate-500 rounded-full">{status}</span>;
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display transition-colors duration-300">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title="Monitoring Pembayaran" />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300 ease-in-out">
                    <div className="max-w-6xl mx-auto space-y-10">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Monitoring Pembayaran</h2>
                                <p className="text-slate-500 dark:text-slate-400">Kelola dan pantau seluruh transaksi pembayaran dari pengguna.</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[30px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative flex-grow w-full">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                                <input 
                                    type="text" 
                                    placeholder="Cari User / Email / Invoice ID..." 
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyUp={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>
                            <div className="w-full md:w-64">
                                <Select 
                                    options={statusOptions}
                                    value={statusOptions.find(opt => opt.value === status)}
                                    onChange={(opt) => {
                                        setStatus(opt.value);
                                        router.get(route('admin.payments.index'), { search, status: opt.value }, { preserveState: true });
                                    }}
                                    classNames={{
                                        control: (state) => `!bg-slate-50 dark:!bg-slate-800 !border-none !rounded-2xl !px-4 !py-1.5 focus-within:!ring-2 focus-within:!ring-red-500/20`,
                                        menu: () => `!bg-white dark:!bg-slate-900 !border !border-slate-100 dark:!border-slate-800 !rounded-2xl !overflow-hidden !shadow-2xl !mt-2`,
                                        option: (state) => `!px-5 !py-3 !text-sm ${state.isSelected ? '!bg-red-500 !text-white' : state.isFocused ? '!bg-red-500/10 !text-red-500' : '!text-slate-600 dark:!text-slate-300'} !font-bold !cursor-pointer transition-colors`,
                                        singleValue: () => `!text-slate-900 dark:!text-white !font-bold`,
                                        placeholder: () => `!text-slate-400`,
                                        dropdownIndicator: () => `!text-slate-400`,
                                        indicatorSeparator: () => `!bg-slate-200 dark:!bg-slate-700`,
                                    }}
                                    unstyled
                                    placeholder="Pilih Status"
                                />
                            </div>
                            <button 
                                onClick={handleFilter}
                                className="w-full md:w-auto px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-red-500/20"
                            >
                                Filter
                            </button>
                        </div>

                        {/* Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden text-slate-900 dark:text-white">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                            <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
                                            <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Paket</th>
                                            <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Total</th>
                                            <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Invoice ID</th>
                                            <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {transactions.data.map((transaction) => (
                                            <tr key={transaction.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="font-black text-slate-900 dark:text-white">{transaction.user?.name}</div>
                                                    <div className="text-xs text-slate-400">{transaction.user?.email}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                        {transaction.package_price?.package?.name || 'Manual'}
                                                    </div>
                                                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                                                        {new Date(transaction.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="font-black text-slate-900 dark:text-white">
                                                        Rp {new Intl.NumberFormat('id-ID').format(transaction.grand_total)}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {getStatusBadge(transaction.status)}
                                                </td>
                                                <td className="px-8 py-6 font-mono text-xs text-slate-500">
                                                    {transaction.xendit_invoice_id}
                                                </td>
                                                <td className="px-8 py-6">
                                                    {transaction.xendit_invoice_url && (
                                                        <a 
                                                            href={transaction.xendit_invoice_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-xs font-black text-red-500 hover:text-red-600 uppercase tracking-widest"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">receipt</span>
                                                            Invoice
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            <div className="px-8 py-6 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                                <p className="text-sm text-slate-500">
                                    Menampilkan {transactions.from || 0} sampai {transactions.to || 0} dari {transactions.total} transaksi
                                </p>
                                <div className="flex gap-2">
                                    {transactions.links.map((link, i) => {
                                        const Tag = link.url ? Link : 'span';
                                        return (
                                            <Tag
                                                key={i}
                                                href={link.url}
                                                className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${link.active ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <DashboardFooter />
        </div>
    );
}
