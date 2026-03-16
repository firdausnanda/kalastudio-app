import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
    business = null,
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            business_name: business?.name ?? '',
            business_type: business?.type ?? '',
            business_address: business?.address ?? '',
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">person</span>
                    Informasi Profil & Bisnis
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Perbarui informasi profil akun dan detail bisnis Anda di sini.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-10 max-w-4xl">
                {/* Personal Information Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/50">
                        <span className="material-symbols-outlined text-primary text-xl">account_circle</span>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Informasi Pribadi</h3>
                    </div>

                    <div className="grid gap-6 p-6 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border border-slate-100/50 dark:border-slate-700/30">
                        <div className="space-y-2">
                            <InputLabel htmlFor="name" value="Nama Lengkap" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" />
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors">person</span>
                                <TextInput
                                    id="name"
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none dark:text-slate-200 dark:placeholder-slate-500 shadow-sm"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Masukkan nama lengkap"
                                />
                            </div>
                            <InputError className="mt-2" message={errors.name} />
                        </div>
                    </div>
                </div>

                {/* Business Information Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800/50">
                        <span className="material-symbols-outlined text-primary text-xl">business_center</span>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Informasi Bisnis</h3>
                    </div>

                    <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 rounded-3xl border border-slate-100/50 dark:border-slate-700/30 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <InputLabel htmlFor="business_name" value="Nama Bisnis" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" />
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors">storefront</span>
                                    <TextInput
                                        id="business_name"
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none dark:text-slate-200 dark:placeholder-slate-500 shadow-sm"
                                        value={data.business_name}
                                        onChange={(e) => setData('business_name', e.target.value)}
                                        required
                                        placeholder="Nama Toko / Bisnis"
                                    />
                                </div>
                                <InputError className="mt-2" message={errors.business_name} />
                            </div>

                            <div className="space-y-2">
                                <InputLabel htmlFor="business_type" value="Jenis / Kategori Bisnis" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" />
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors">category</span>
                                    <TextInput
                                        id="business_type"
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none dark:text-slate-200 dark:placeholder-slate-500 shadow-sm"
                                        value={data.business_type}
                                        onChange={(e) => setData('business_type', e.target.value)}
                                        placeholder="E.g. Kuliner, Fashion, Jasa"
                                    />
                                </div>
                                <InputError className="mt-2" message={errors.business_type} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <InputLabel htmlFor="business_address" value="Alamat Operasional" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1" />
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-3 top-4 text-slate-400 text-xl group-focus-within:text-primary transition-colors">location_on</span>
                                <textarea
                                    id="business_address"
                                    className="w-full pl-10 pr-4 py-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none dark:text-slate-200 dark:placeholder-slate-500 min-h-[120px] shadow-sm resize-none"
                                    value={data.business_address}
                                    onChange={(e) => setData('business_address', e.target.value)}
                                    placeholder="Alamat lengkap bisnis Anda"
                                />
                            </div>
                            <InputError className="mt-2" message={errors.business_address} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0 translate-x-4"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0 translate-x-4"
                    >
                        <p className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2 bg-green-50 dark:bg-green-950/20 px-4 py-2 rounded-full border border-green-100 dark:border-green-900/30">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            Data berhasil diperbarui
                        </p>
                    </Transition>

                    <PrimaryButton
                        className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 shadow-xl shadow-primary/25 dark:shadow-none flex justify-center items-center gap-3 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 text-sm uppercase tracking-wider"
                        disabled={processing}
                    >
                        <span className="material-symbols-outlined text-xl">save</span>
                        Simpan Perubahan
                    </PrimaryButton>
                </div>
            </form>

        </section>
    );
}
