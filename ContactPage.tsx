import React, { useState } from 'react';
import { Store } from '../services/store';

const ContactPage: React.FC = () => {
  const settings = Store.getSettings();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', request: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    const success = await Store.addPrayerRequest({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      request: formData.request
    });

    setLoading(false);
    if (success) {
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', request: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } else {
      setStatus('error');
    }
  };

  const socialLogos = {
    FB: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>,
    YT: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    WA: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 .004 5.411.001 12.049a11.81 11.81 0 0 0 1.602 6.002L0 24l6.163-1.617a11.83 11.83 0 0 0 5.883 1.564h.005c6.634 0 12.044-5.41 12.047-12.049a11.79 11.79 0 0 0-3.483-8.513z"/></svg>
  };

  return (
    <div className="bg-white">
      <section className="bg-vimNavy py-32 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-vimGold font-black uppercase tracking-[0.4em] text-xs">Reach the Hub</span>
          <h1 className="text-5xl md:text-7xl font-serif font-black">Contact Us</h1>
          <p className="text-white/60 text-xl font-light max-w-2xl mx-auto">We are here to support your spiritual journey and answer your inquiries.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 space-y-10">
              <div className="space-y-4">
                <p className="text-vimGold font-black uppercase tracking-[0.2em] text-[10px]">Ministry HQ</p>
                <p className="text-vimNavy font-bold text-lg leading-relaxed">{settings.address}</p>
              </div>
              <div className="space-y-4">
                <p className="text-vimGold font-black uppercase tracking-[0.2em] text-[10px]">Counselling Line</p>
                <p className="text-vimNavy font-black text-2xl">{settings.phone}</p>
              </div>
              <div className="space-y-4">
                <p className="text-vimGold font-black uppercase tracking-[0.2em] text-[10px]">Global Enquiries</p>
                <p className="text-vimNavy font-bold">{settings.email}</p>
              </div>
              <div className="pt-8 border-t border-slate-50 flex gap-4">
                 {[
                   { id: 'FB', url: settings.facebookUrl },
                   { id: 'YT', url: settings.youtubeUrl },
                   { id: 'WA', url: settings.whatsappUrl }
                 ].map(social => (
                   <a 
                    key={social.id} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-vimNavy flex items-center justify-center text-white hover:bg-vimGold hover:text-vimNavy transition-all shadow-sm"
                    title={social.id}
                   >
                     {socialLogos[social.id as keyof typeof socialLogos] || social.id}
                   </a>
                 ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-12 md:p-16 rounded-[3.5rem] shadow-2xl border border-slate-100">
             <h3 className="text-vimNavy text-3xl font-serif font-black mb-10 tracking-tight">Send a Spiritual Message</h3>
             
             {status === 'success' ? (
               <div className="py-20 text-center space-y-6 animate-in fade-in zoom-in-95">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
                  <h4 className="text-vimNavy text-2xl font-serif font-black">Message Received</h4>
                  <p className="text-gray-400 max-w-sm mx-auto">Your prayer request has been delivered to the altar. The VIM intercessory team will be standing in gap for you.</p>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-vimNavy uppercase tracking-widest ml-1">Your Full Name</label>
                   <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-vimGold transition-all" 
                    placeholder="John Doe" 
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-vimNavy uppercase tracking-widest ml-1">Email Address</label>
                   <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-vimGold transition-all" 
                    placeholder="email@example.com" 
                   />
                 </div>
                 <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-vimNavy uppercase tracking-widest ml-1">Phone Number (Optional)</label>
                   <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-vimGold transition-all" 
                    placeholder="+234 ..." 
                   />
                 </div>
                 <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-vimNavy uppercase tracking-widest ml-1">Message Body / Prayer Request</label>
                   <textarea 
                    rows={6} 
                    required
                    value={formData.request}
                    onChange={e => setFormData({...formData, request: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-3xl px-6 py-6 outline-none focus:border-vimGold transition-all resize-none" 
                    placeholder="How can we pray with you or help?"
                   ></textarea>
                 </div>
                 <div className="md:col-span-2">
                   <button 
                    disabled={loading}
                    className="w-full gold-gradient text-vimNavy py-6 rounded-2xl font-black text-lg shadow-xl uppercase tracking-widest hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                   >
                     {loading ? 'Submitting to the Altar...' : 'Submit Engagement'}
                   </button>
                   {status === 'error' && <p className="text-red-500 text-[10px] font-bold text-center mt-4">Communication failed. Please check your connection and try again.</p>}
                 </div>
               </form>
             )}
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;