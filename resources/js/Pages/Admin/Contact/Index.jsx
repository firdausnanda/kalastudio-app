import { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'moment/locale/id';

moment.locale('id');

export default function ContactIndex({ auth, contacts }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openDetailModal = (contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);

    // If unread, mark as read via router using PATCH
    if (contact.status === 'unread') {
      router.patch(route('admin.contacts.read', contact.id), {}, {
        preserveScroll: true,
        onSuccess: () => {
          setSelectedContact(prev => prev ? { ...prev, status: 'read' } : null);
        }
      });
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedContact(null);
  };

  const handleDelete = (contact) => {
    Swal.fire({
      title: 'Hapus Pesan?',
      text: `Pesan dari "${contact.name}" akan dihapus permanen.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('admin.contacts.destroy', contact.id), {
          preserveScroll: true,
          onSuccess: () => Swal.fire('Terhapus!', 'Pesan telah berhasil dihapus.', 'success')
        });
      }
    });
  };

  const filteredContacts = contacts.data.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display">
      <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Head title="Pesan Masuk" />

      <div className="flex flex-grow relative overflow-hidden">
        <AdminSidebar isSidebarOpen={isSidebarOpen} />

        <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300">
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Pesan Masuk</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Kelola pesan dan pertanyaan dari pelanggan Anda.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                <div className="relative w-full md:w-96 group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">search</span>
                  <input
                    type="text"
                    placeholder="Cari pesan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-bold dark:text-white"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pengirim</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subjek & Pesan</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tanggal</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                    {filteredContacts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <span className="material-symbols-outlined text-4xl text-slate-200">mail</span>
                            <p className="text-slate-400 font-bold text-sm">Tidak ada pesan ditemukan.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredContacts.map((contact) => (
                        <tr key={contact.id} className={`hover:bg-slate-50/30 dark:hover:bg-slate-800/20 ${contact.status === 'unread' ? 'bg-red-50/30 dark:bg-red-500/5' : ''}`}>
                          <td className="px-8 py-6">
                            <p className="text-sm font-black text-slate-900 dark:text-white">{contact.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{contact.email}</p>
                            <p className="text-xs text-slate-400 font-medium">{contact.phone}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-black text-slate-700 dark:text-slate-200">{contact.subject}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">{contact.message}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              contact.status === 'unread' 
                                ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' 
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {contact.status === 'unread' ? 'Belum Dibaca' : 'Sudah Dibaca'}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {moment(contact.created_at).format('DD MMM YYYY')}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {moment(contact.created_at).format('HH:mm')} WIB
                            </p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => openDetailModal(contact)}
                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50"
                              >
                                <span className="material-symbols-outlined">visibility</span>
                              </button>
                              <button
                                onClick={() => handleDelete(contact)}
                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50"
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-8 py-6 bg-slate-50/50 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Halaman {contacts.current_page} dari {contacts.last_page}
                </p>
                <div className="flex gap-2">
                  {contacts.links.map((link, i) => (
                    <Link key={i} href={link.url || '#'} className={`px-3 py-1.5 rounded-lg text-xs font-black ${link.active ? 'bg-red-500 text-white' : 'bg-white text-slate-500'} ${!link.url ? 'opacity-30' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <DashboardFooter />

      <Modal show={isDetailModalOpen} onClose={closeDetailModal} maxWidth="2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Detail Pesan</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Informasi lengkap pesan dari pengirim.</p>
            </div>
            <button 
              type="button" 
              onClick={closeDetailModal}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all shadow-sm"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {selectedContact && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nama Pengirim</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alamat Email</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{selectedContact.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Kirim</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{moment(selectedContact.created_at).format('DD MMMM YYYY, HH:mm')} WIB</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Subjek Pesan</p>
                <div className="px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800">
                  {selectedContact.subject}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Isi Pesan</p>
                <div className="px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800 shadow-sm min-h-[150px]">
                  {selectedContact.message}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <a 
                  href={`mailto:${selectedContact.email}`}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 shadow-xl shadow-slate-200 dark:shadow-none flex items-center justify-center gap-3 group active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg transition-transform group-hover:rotate-12">mail</span>
                  Balas via Email
                </a>
                <a 
                  href={`https://wa.me/${selectedContact.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 group active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg transition-transform group-hover:scale-110">call</span>
                  Balas via WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
