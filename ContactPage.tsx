
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
                   <a key={social.id} href={social.url} target="_blank" className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-vimNavy font-black text-xs hover:bg-vimGold hover:text-white transition-all shadow-sm">
                     {social.id}
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
