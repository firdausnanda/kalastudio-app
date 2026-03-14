import Header from '@/Components/Header';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Spinner from '@/Components/Spinner';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="bg-slate-50 dark:bg-[#1a202c] font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
            <Head title="Konfirmasi Kata Sandi" />
            <Header />

            <main className="flex-grow flex items-center justify-center px-4 pt-10 pb-12">
                <div className="w-full max-w-[440px]">
                    <div className="bg-white dark:bg-slate-900/50 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-xl p-8 md:p-10 transition-colors duration-300">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2 dark:text-white">Konfirmasi Password</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Ini adalah area aman. Harap konfirmasi kata sandi Anda sebelum melanjutkan.
                            </p>
                        </div>

                        <form onSubmit={submit}>
                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Kata Sandi"
                                    className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
                                />
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none dark:text-slate-200 dark:placeholder-slate-500"
                                        isFocused={true}
                                        placeholder="••••••••"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-8">
                                <PrimaryButton
                                    className="w-full group bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 dark:shadow-primary/20 flex justify-center items-center gap-2 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <Spinner size="sm" />
                                            <span>Mengonfirmasi...</span>
                                        </>
                                    ) : (
                                        <>
                                            Konfirmasi
                                            <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1.5">check_circle</span>
                                        </>
                                    )}
                                </PrimaryButton>
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
