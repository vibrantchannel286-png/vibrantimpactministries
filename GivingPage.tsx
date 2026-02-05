import React, { useState } from 'react';
import { Store } from '../services/store';

const GivingPage: React.FC = () => {
  const settings = Store.getSettings();
  const [showEnlistModal, setShowEnlistModal] = useState(false);
  const [partnerForm, setPartnerForm] = useState({ name: '', email: '', phone: '' });
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');

  const handleEnlist = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentComplete = () => {
    setStep('success');
    setTimeout(() => {
      window.open(settings.partnershipWhatsappUrl, '_blank');
      setShowEnlistModal(false);
      setStep('info');
    }, 3000);
  };

  const openFlutterwave = () => {
    if (settings.flutterwaveLink) {
      window.open(settings.flutterwaveLink, '_blank');
      handlePaymentComplete();
    } else {
      alert("Online payment link is currently being updated. Please use the direct bank transfer method.");
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden bg-vimNavy">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb8?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            alt="Giving"
          />
        </div>
        <div className="relative z-10 text-center space-y-4 px-6">
          <span className="text-vimGold font-black uppercase tracking-[0.3em] text-xs">{settings.givingSubtitle}</span>
          <h1 className="text-white font-serif text-5xl md:text-8xl font-black drop-shadow-2xl tracking-tighter">{settings.givingHeading}</h1>
        </div>
      </section>

      {/* Biblical Foundation */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center space-y-10">
        <div className="w-20 h-1 bg-vimGold mx-auto rounded-full"></div>
        <p className="text-vimNavy text-3xl font-serif italic leading-relaxed font-medium">
          "{settings.givingFoundationText}"
        </p>
      </section>

      {/* Bank Details Grid */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-vimNavy text-4xl font-serif font-black tracking-tight">Financial Channels</h2>
            <p className="text-gray-500 font-medium italic">Supporting the Global Impact of the prophetic Word.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {settings.bankAccounts.map((acc) => (
              <div key={acc.id} className="bg-white p-12 rounded-[3.5rem] shadow-premium border border-slate-100 space-y-8 group hover:border-vimGold transition-all duration-500">
                <div className="flex justify-between items-start">
                  <span className="inline-block bg-vimNavy text-vimGold text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{acc.label}</span>
                  <span className="text-2xl">🏛️</span>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Bank Name</p>
                    <p className="text-vimNavy text-xl font-black">{acc.bankName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Account Number</p>
                    <p className="text-vimGold text-4xl font-serif font-black tracking-tighter">{acc.accountNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Account Name</p>
                    <p className="text-vimNavy font-bold uppercase text-xs tracking-wider">{acc.accountName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kingdom Partnership */}
      <section className="max-w-7xl mx-auto px-8 lg:px-24 py-40 flex flex-col lg:flex-row items-center gap-24">
        <div className="w-full lg:w-1/2 space-y-10">
          <div className="space-y-4">
            <span className="text-vimGold font-black uppercase tracking-[0.4em] text-[10px]">Territorial Transformation</span>
            <h2 className="text-vimNavy text-6xl font-serif font-black tracking-tighter leading-[1.1]">Kingdom <br/>Partnership</h2>
          </div>
          <p className="text-gray-400 text-xl leading-relaxed font-light">
            Partnership is a covenant relationship between believers who share a common goal of reaching the world with the gospel. By becoming a VIM Partner, you are part of every soul won and every life transformed.
          </p>
          <div className="space-y-4 pt-4">
             {settings.partnershipFeatures.map((feature, i) => (
               <div key={i} className="flex items-center gap-6 text-vimNavy font-black text-xs uppercase tracking-widest">
                 <span className="w-10 h-10 rounded-full bg-vimGold/10 flex items-center justify-center text-vimGold">✓</span>
                 {feature}
               </div>
             ))}
          </div>
          <button 
            onClick={() => setShowEnlistModal(true)}
            className="bg-vimNavy text-white px-16 py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-vimGold hover:text-vimNavy transition-all mt-8"
          >
            Enlist as a Partner
          </button>
        </div>
        <div className="w-full lg:w-1/2 relative group">
           <div className="aspect-square rounded-[4rem] overflow-hidden shadow-premium">
             <img 
              src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Partnership"
             />
           </div>
        </div>
      </section>

      {/* Enlistment Modal */}
      {showEnlistModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-vimNavy/90 backdrop-blur-xl animate-in fade-in duration-500">
           <div className="bg-white max-w-lg w-full rounded-[3.5rem] overflow-hidden shadow-2xl relative">
              <button onClick={() => setShowEnlistModal(false)} className="absolute top-8 right-8 text-vimNavy hover:text-vimGold transition-colors text-2xl font-black">✕</button>
              
              <div className="p-12 md:p-16 space-y-10">
                 {step === 'info' && (
                   <>
                    <div className="space-y-4">
                      <h4 className="text-3xl font-serif font-black tracking-tight text-vimNavy">Partnership Covenant</h4>
                      <p className="text-gray-400 text-sm">Please provide your details to initiate your partnership enrollment.</p>
                    </div>
                    <form onSubmit={handleEnlist} className="space-y-6">
                       <input type="text" required placeholder="Full Name" value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none border-2 border-transparent focus:border-vimGold/20" />
                       <input type="email" required placeholder="Email Address" value={partnerForm.email} onChange={e => setPartnerForm({...partnerForm, email: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none border-2 border-transparent focus:border-vimGold/20" />
                       <input type="tel" required placeholder="Phone Number" value={partnerForm.phone} onChange={e => setPartnerForm({...partnerForm, phone: e.target.value})} className="w-full bg-slate-50 p-6 rounded-2xl outline-none border-2 border-transparent focus:border-vimGold/20" />
                       <button className="w-full bg-vimNavy text-vimGold py-6 rounded-2xl font-black uppercase tracking-widest">Proceed to Seed</button>
                    </form>
                   </>
                 )}

                 {step === 'payment' && (
                    <div className="text-center space-y-10 py-10">
                       <h4 className="text-3xl font-serif font-black text-vimNavy">Commit Your Seed</h4>
                       <p className="text-gray-400 text-sm">After payment via Flutterwave or Bank Transfer, you will be redirected to the exclusive VIM Partners Circle.</p>
                       <div className="grid grid-cols-1 gap-6">
                          <button onClick={openFlutterwave} className="w-full gold-gradient py-6 rounded-2xl font-black text-vimNavy uppercase tracking-widest shadow-lg">PAY WITH FLUTTERWAVE</button>
                          <button onClick={handlePaymentComplete} className="w-full bg-vimNavy text-white py-6 rounded-2xl font-black uppercase tracking-widest border border-white/10">I HAVE TRANSFERRED (MANUAL)</button>
                       </div>
                    </div>
                 )}

                 {step === 'success' && (
                    <div className="text-center py-20 space-y-10 animate-in zoom-in-95">
                       <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl">✓</div>
                       <div className="space-y-4">
                          <h4 className="text-3xl font-serif font-black text-vimNavy">Enlistment Success</h4>
                          <p className="text-gray-400">Welcome to the family. Redirecting you to the VIM Partners WhatsApp group...</p>
                       </div>
                       <div className="w-12 h-1 bg-vimGold mx-auto rounded-full animate-pulse"></div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default GivingPage;