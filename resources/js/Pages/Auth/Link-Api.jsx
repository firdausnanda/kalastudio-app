import Header from '@/Components/Header';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Spinner from '@/Components/Spinner';
import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function LinkApi({ email }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    email: email || '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();

    post(route('api.link.process'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-[#1a202c] font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
      <Head title="Tautkan Akun" />
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 pt-10 pb-12">
        <div className="w-full max-w-[480px]">
          <div className="bg-white dark:bg-slate-900/50 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-2xl p-8 md:p-10 transition-all duration-300 relative overflow-hidden group">
            {/* Decorative background element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>

            <div className="text-center mb-8 relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary animate-bounce-subtle">
                <span className="material-symbols-outlined text-3xl">key</span>
              </div>
              <h2 className="text-3xl font-black mb-3 dark:text-white tracking-tight">Tautkan Akun</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-[320px] mx-auto">
                Untuk mengakses dashboard, silakan verifikasi kredensial akun Anda.
              </p>
            </div>

            <form onSubmit={submit} className="relative z-10">
              <div className="space-y-5">
                <div className="mb-4">
                  <InputLabel
                    htmlFor="email"
                    value="Email Akun"
                    className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-500 dark:text-slate-400"
                  />
                  <div className="relative group/input">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl transition-colors group-focus-within/input:text-primary">mail</span>
                    <TextInput
                      id="email"
                      type="email"
                      name="email"
                      value={data.email}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none dark:text-slate-400 font-medium cursor-not-allowed border-dashed"
                      readOnly
                      disabled
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 italic">Email ini terhubung otomatis dengan akun login Anda.</p>
                </div>

                <div className="mb-4">
                  <InputLabel
                    htmlFor="password"
                    value="Kata Sandi API"
                    className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-500 dark:text-slate-400"
                  />
                  <div className="relative group/input">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl transition-colors group-focus-within/input:text-primary">lock</span>
                    <TextInput
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={data.password}
                      className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none dark:text-slate-200"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      onChange={(e) => setData('password', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors flex items-center justify-center p-1"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel
                    htmlFor="password_confirmation"
                    value="Konfirmasi Kata Sandi"
                    className="block text-xs font-black uppercase tracking-widest mb-2 text-slate-500 dark:text-slate-400"
                  />
                  <div className="relative group/input">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl transition-colors group-focus-within/input:text-primary">verified_user</span>
                    <TextInput
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={data.password_confirmation}
                      className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none dark:text-slate-200"
                      placeholder="••••••••"
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors flex items-center justify-center p-1"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <InputError message={errors.password_confirmation} className="mt-2" />
                </div>
              </div>

              <div className="mt-10">
                <PrimaryButton
                  className="w-full group bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all duration-300 shadow-xl shadow-primary/30 dark:shadow-primary/20 flex justify-center items-center gap-3 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Spinner size="sm" />
                      <span>Memproses Tautan...</span>
                    </>
                  ) : (
                    <>
                      Tautkan Sekarang
                      <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1.5">sync_alt</span>
                    </>
                  )}
                </PrimaryButton>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link
                  href={route('logout')}
                  method="post"
                  as="button"
                  className="text-sm font-bold text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Gunakan akun lain? Keluar sesi
                </Link>
              </div>
            </form>
          </div>

          {/* Security Badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600">
            <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
            <p className="text-[10px] font-bold uppercase tracking-widest">Koneksi Dienkripsi & Aman</p>
          </div>
        </div>
      </main>

      <footer className="py-8 px-6 text-center text-slate-400 text-xs font-medium">
        <p>© 2026 KalaStudio. All rights reserved.</p>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
            ` }} />
    </div>
  );
}
