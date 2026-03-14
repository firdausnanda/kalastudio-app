import Header from '@/Components/Header';
import PrimaryButton from '@/Components/PrimaryButton';
import Spinner from '@/Components/Spinner';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <div className="bg-slate-50 dark:bg-[#1a202c] font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
            <Head title="Verifikasi Email" />
            <Header />

            <main className="flex-grow flex items-center justify-center px-4 pt-10 pb-12">
                <div className="w-full max-w-[480px]">
                    <div className="bg-white dark:bg-slate-900/50 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-xl p-8 md:p-10 transition-colors duration-300">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2 dark:text-white">Verifikasi Email</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Terima kasih telah mendaftar! Sebelum memulai, silakan verifikasi alamat email Anda dengan mengeklik tautan yang baru saja kami kirimkan ke email Anda.
                            </p>
                        </div>

                        {status === 'verification-link-sent' && (
                            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-xl text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-top-2 duration-500">
                                Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="flex flex-col gap-4">
                                <PrimaryButton
                                    className="w-full group bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 dark:shadow-primary/20 flex justify-center items-center gap-2 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Spinner size="sm" />
                                            <span>Mengirim...</span>
                                        </>
                                    ) : (
                                        <>
                                            Kirim Ulang Email Verifikasi
                                            <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:rotate-12">forward_to_inbox</span>
                                        </>
                                    )}
                                </PrimaryButton>

                                <div className="text-center mt-2">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="text-sm font-semibold text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-colors inline-flex items-center gap-1 group"
                                    >
                                        <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:-translate-x-1">logout</span>
                                        Keluar
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="py-8 px-6 text-center text-slate-400 text-xs">
                <p>© 2026 KalaStudio. All rights reserved.</p>
            </footer>
        </div>
    );
}
