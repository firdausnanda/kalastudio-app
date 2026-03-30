import { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { toast, Toaster } from 'sonner';

export default function ContactPage() {
  const { flash } = usePage().props;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash]);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('kontak.store'), {
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };

  const contactInfos = [
    {
      icon: 'mail',
      title: 'Email Kami',
      detail: 'team@kalastudioai.com',
      link: 'mailto:team@kalastudioai.com',
      color: 'bg-primary/10 text-primary'
    },
    {
      icon: 'call',
      title: 'WhatsApp',
      detail: '+62 812 1712 2497',
      link: 'https://wa.me/6281217122497',
      color: 'bg-green-500/10 text-green-500'
    },
    {
      icon: 'location_on',
      title: 'Kantor Pusat',
      detail: 'Kab. Trenggalek, Jawa Timur, Indonesia',
      link: 'https://maps.app.goo.gl/nRzUHghGCLWonRyt8',
      color: 'bg-blue-500/10 text-blue-500'
    }
  ];

  const socialLinks = [
    {
      icon: 'instagram',
      title: 'Instagram',
      link: '#'
    },
    {
      icon: 'tiktok',
      title: 'Tiktok',
      link: '#'
    },
    {
      icon: 'youtube',
      title: 'Youtube',
      link: '#'
    }
  ];

  return (
    <div className="bg-white text-slate-900 font-display transition-colors duration-300 dark:bg-slate-900 min-h-screen flex flex-col">
      <Toaster position="top-center" richColors />
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-slate-50 dark:bg-slate-800/30 py-20 px-4 transition-colors duration-300">
          <div className="max-w-4xl mx-auto text-center border-b border-slate-200 dark:border-slate-800 pb-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
              Hubungi <span className="text-primary">Kami</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Punya pertanyaan atau butuh bantuan lebih lanjut tentang KalaStudio? Tim kami siap mendampingi kesuksesan bisnis Anda.
            </p>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16">
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-3xl font-black mb-6 dark:text-white">Mari Berdiskusi</h2>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  Pilih cara yang paling nyaman bagi Anda untuk menghubungi kami. Kami biasanya merespons dalam waktu kurang dari 24 jam.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfos.map((info, idx) => (
                  <a
                    key={idx}
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-6 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all group"
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${info.color} group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined text-3xl">{info.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{info.title}</h4>
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200 leading-none">{info.detail}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="pt-8">
                <h4 className="font-bold mb-4 dark:text-white">Ikuti Media Sosial Kami</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, idx) => (
                    <a key={idx} href={social.link} className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                      {social.icon === 'instagram' && (
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      )}
                      {social.icon === 'tiktok' && (
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                      )}
                      {social.icon === 'youtube' && (
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[40px] shadow-2xl shadow-primary/5 border border-slate-100 dark:border-slate-800">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                      <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        required
                        placeholder="Contoh: Budi Santoso"
                        className={`w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Alamat Email</label>
                      <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        required
                        placeholder="budi@email.com"
                        className={`w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      name="phone"
                      value={data.phone}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: 08123456789"
                      className={`w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Subjek</label>
                    <input
                      type="text"
                      name="subject"
                      value={data.subject}
                      onChange={handleChange}
                      required
                      placeholder="Apa yang ingin Anda tanyakan?"
                      className={`w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white ${errors.subject ? 'ring-2 ring-red-500' : ''}`}
                    />
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Pesan</label>
                    <textarea
                      rows="5"
                      name="message"
                      value={data.message}
                      onChange={handleChange}
                      required
                      placeholder="Tuliskan pesan Anda di sini..."
                      className={`w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white resize-none ${errors.message ? 'ring-2 ring-red-500' : ''}`}
                    ></textarea>
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-[20px] shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined">{processing ? 'sync' : 'send'}</span>
                    {processing ? 'Sedang Mengirim...' : 'Kirim Pesan Sekarang'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Official Location Map */}
        <section className="py-20 px-4 bg-slate-50 dark:bg-slate-800/20">
          <div className="max-w-7xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white dark:bg-slate-800 h-[500px] rounded-[40px] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3950.489433612349!2d111.71271647499696!3d-8.05140519197607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOMKwMDMnMDUuMSJTIDExMcKwNDInNTUuMSJF!5e0!3m2!1sid!2sid!4v1774835738870!5m2!1sid!2sid" 
                  className="w-full h-full grayscale-[20%] contrast-[1.1] brightness-[0.9] invert-[0] dark:invert-[0.9] dark:hue-rotate-[180deg]"
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                
                {/* Map Overlay Button */}
                <div className="absolute bottom-8 right-8">
                  <a 
                    href="https://maps.app.goo.gl/nRzUHghGCLWonRyt8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-6 py-3 rounded-2xl font-bold shadow-2xl hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 group/btn"
                  >
                    <span className="material-symbols-outlined text-primary group-hover/btn:text-white transition-colors">map</span>
                    Buka di Google Maps
                  </a>
                </div>
                
                {/* Location Badge */}
                <div className="absolute top-8 left-8 hidden md:block">
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl max-w-xs">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">Kantor Kami</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-100">Sumbergedong, Trenggalek</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
