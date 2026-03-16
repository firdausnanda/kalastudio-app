import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardSidebar from '@/Components/DashboardSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import SubscriptionInfo from './Partials/SubscriptionInfo';
import Modal from '@/Components/Modal';

export default function Edit({ mustVerifyEmail, status, business }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
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

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display transition-colors duration-300">
            <Head title="Profil" />

            <DashboardHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            <div className="flex flex-grow relative overflow-hidden">
                <DashboardSidebar isSidebarOpen={isSidebarOpen} />

                <div
                    className={`
                        fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300
                        ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    `}
                    onClick={() => setIsSidebarOpen(false)}
                ></div>

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300 ease-in-out">
                    <div className="px-5 mx-auto space-y-10">
                        {/* Header Section */}
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Pengaturan Profil</h2>
                            <p className="text-slate-500 dark:text-slate-400">Kelola informasi akun dan keamanan Anda di sini.</p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
                            {/* Left Column: Profile & Business Info */}
                            <div className="w-full lg:w-[60%] space-y-8">
                                <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        business={business}
                                    />
                                </div>
                            </div>

                            {/* Right Column: Subscription & Security */}
                            <div className="w-full lg:w-[40%] space-y-8">
                                <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                    <SubscriptionInfo />
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                                    <header className="mb-6">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary">security</span>
                                            Keamanan Akun
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            Kelola kata sandi akun Anda.
                                        </p>
                                    </header>
                                    
                                    <button
                                        onClick={() => setIsPasswordModalOpen(true)}
                                        className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-3 group"
                                    >
                                        <span className="material-symbols-outlined text-primary group-hover:rotate-12 transition-transform">lock_reset</span>
                                        Ubah Kata Sandi
                                    </button>

                                    <Modal show={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
                                        <div className="p-8 md:p-10 dark:bg-slate-900">
                                            <UpdatePasswordForm 
                                                onSuccess={() => setIsPasswordModalOpen(false)} 
                                            />
                                        </div>
                                    </Modal>
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
