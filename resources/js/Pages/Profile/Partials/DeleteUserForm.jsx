import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="mb-8">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-3">
                    <span className="material-symbols-outlined">delete_forever</span>
                    Hapus Akun
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. 
                    Sebelum menghapus akun, mohon unduh data atau informasi apa pun yang ingin Anda pertahankan.
                </p>
            </header>

            <button 
                onClick={confirmUserDeletion}
                className="w-full md:w-auto bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <span className="material-symbols-outlined text-xl">delete</span>
                Hapus Akun Saya
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8 md:p-10 bg-white dark:bg-slate-900 font-display">
                    <div className="flex items-center gap-4 mb-6 text-red-600 dark:text-red-400">
                        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black">Apakah Anda yakin?</h2>
                            <p className="text-sm font-bold opacity-60">Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-8">
                        Semua data Anda akan dihapus secara permanen. Silakan masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun secara permanen.
                    </p>

                    <div className="space-y-2">
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi"
                            className="text-sm font-bold text-slate-700 dark:text-slate-300"
                        />

                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none dark:text-slate-200 dark:placeholder-slate-500"
                                isFocused
                                placeholder="Masukkan kata sandi untuk konfirmasi"
                            />
                        </div>

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-10 flex flex-col md:flex-row justify-end gap-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase tracking-widest text-xs"
                        >
                            Batalkan
                        </button>

                        <button 
                            className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black shadow-lg shadow-red-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                            disabled={processing}
                        >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            Hapus Permanen
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
