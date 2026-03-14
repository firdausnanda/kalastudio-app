import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Header from '@/Components/Header';
import Spinner from '@/Components/Spinner';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        if (!data.terms) {
            setError('terms', 'Anda harus menyetujui Syarat dan Ketentuan untuk mendaftar.');
            return;
        }

        clearErrors('terms');
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="bg-slate-50 dark:bg-[#1a202c] font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
            <Header />

            <main className="flex-grow flex items-center justify-center px-4 pt-10 pb-12">
                <div className="w-full max-w-[440px]">
                    <div className="bg-white dark:bg-slate-900/50 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-xl p-8 md:p-10 transition-colors duration-300">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2 dark:text-white">Buat Akun Baru</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Mulai kelola keuangan Anda lebih cerdas hari ini</p>
                        </div>
                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="name" value="Nama Lengkap" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300" />
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none dark:text-slate-200 dark:placeholder-slate-500"
                                        autoComplete="name"
                                        placeholder="Nama Lengkap Anda"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />

                                </div>
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="Email" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300" />
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none dark:text-slate-200 dark:placeholder-slate-500"
                                        autoComplete="username"
                                        placeholder="nama@email.com"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
                                    htmlFor="password"
                                    value="Kata Sandi" />

                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none dark:text-slate-200 dark:placeholder-slate-500"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-all duration-300 hover:scale-110 active:scale-95"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
                                    htmlFor="password_confirmation"
                                    value="Konfirmasi Kata Sandi"
                                />

                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                                    <TextInput
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none dark:text-slate-200 dark:placeholder-slate-500"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        onChange={(e) =>
                                            setData('password_confirmation', e.target.value)
                                        }
                                        required
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-all duration-300 hover:scale-110 active:scale-95"
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>

                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <div className="flex items-start">
                                    <input
                                        className="w-4 h-4 mt-0.5 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:focus:ring-offset-slate-900"
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        checked={data.terms}
                                        onChange={(e) => setData('terms', e.target.checked)}
                                    />
                                    <label className="ml-2 text-sm text-slate-600 dark:text-slate-400 leading-tight" htmlFor="terms">
                                        Saya setuju dengan <Link href="/syarat-ketentuan" className="text-primary hover:underline font-medium">Syarat & Ketentuan</Link> dan <Link href="/kebijakan-privasi" className="text-primary hover:underline font-medium">Kebijakan Privasi</Link>
                                    </label>
                                </div>
                                <InputError message={errors.terms} className="mt-2" />
                            </div>

                            <PrimaryButton className="group w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 dark:shadow-primary/20 flex justify-center items-center gap-2 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={processing}>
                                {processing ? (
                                    <>
                                        <Spinner size="sm" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        Daftar Sekarang
                                        <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1.5">arrow_forward</span>
                                    </>
                                )}
                            </PrimaryButton>
                        </form>
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-800 transition-colors duration-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm uppercase">
                                <span className="bg-white dark:bg-slate-900 px-4 text-slate-500 dark:text-slate-400 transition-colors duration-300">Atau daftar dengan</span>
                            </div>
                        </div>

                        <a
                            href={route('auth.google')}
                            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-500 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]"
                        >
                            <img
                                alt="Google Logo"
                                className="w-5 h-5"
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            />
                            Daftar dengan Google
                        </a>
                    </div>

                    <p className="mt-8 text-center text-slate-600 dark:text-slate-400 text-sm">
                        Sudah punya akun? {" "}
                        <Link className="font-bold text-primary hover:text-primary/80 transition-colors" href="/login">Masuk sekarang</Link>
                    </p>
                </div>
            </main>

            <footer className="py-8 px-6 text-center text-slate-400 text-xs">
                <p>© 2026 KalaStudio. All rights reserved.</p>
            </footer>
        </div>
    )
}
