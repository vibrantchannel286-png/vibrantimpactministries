import React from 'react';
import { Service, ChurchSettings } from '../types';

interface ServicesPageProps {
  services: Service[];
  settings: ChurchSettings;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ services, settings }) => {
  // Helper to get consistent background images like on the home page
  const getServiceBackground = (service: Service, index: number) => {
    if (service.imageUrl) return service.imageUrl;
    
    const title = service.title.toLowerCase();
    if (title.includes('sunday')) return "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80";
    if (title.includes('tuesday')) return "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80";
    if (title.includes('friday')) return "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=800&q=80";
    if (title.includes('vigil')) return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80";
    
    const fallbacks = [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80"
    ];
    return fallbacks[index % fallbacks.length];
  };

  return (
    <div className="bg-white">
      {/* Experience Hero */}
      <section className="relative h-[70vh] flex items-center justify-center bg-vimNavy overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover opacity-30 grayscale mix-blend-luminosity"
            alt="Worship Experience"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-vimNavy/60 via-transparent to-white"></div>
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-8">
          <span className="text-vimGold font-black uppercase tracking-[0.5em] text-[10px] animate-in slide-in-from-top duration-700">The VIM Experience</span>
          <h1 className="text-white font-serif text-6xl md:text-8xl font-black tracking-tighter leading-none animate-in fade-in duration-1000">Enter Into <br/><span className="italic font-normal text-vimGold">His Presence</span></h1>
          <p className="text-white/60 text-xl font-light leading-relaxed max-w-2xl mx-auto animate-in slide-in-from-bottom duration-1000">
            More than just a service, it's a divine encounter. Join us for a journey of transformation.
          </p>
        </div>
      </section>

      {/* What to Expect Section - Cleaned up Emojis, Added Dynamic Photos */}
      <section className="py-32 px-8 lg:px-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-vimGold font-black uppercase tracking-[0.4em] text-[10px]">GUEST INFORMATION</span>
              <h2 className="text-vimNavy font-serif text-5xl font-black tracking-tighter">What to Expect</h2>
            </div>
            
            <div className="space-y-12">
              {(settings.expectations || []).map((item) => (
                <div key={item.id} className="flex gap-8 group">
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 overflow-hidden shadow-premium shrink-0 border border-slate-100 transition-transform group-hover:scale-105 duration-500">
                    <img 
                      src={item.imageUrl} 
                      className="w-full h-full object-cover" 
                      alt={item.title} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-vimNavy font-black text-2xl tracking-tight group-hover:text-vimGold transition-colors">{item.title}</h4>
                    <p className="text-gray-500 font-light leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-premium">
              <img src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1000&q=80" className="w-full h-full object-cover grayscale" alt="Interior" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-vimGold p-10 rounded-[3rem] shadow-2xl max-w-xs hidden md:block">
              <p className="text-vimNavy font-serif italic text-xl leading-relaxed">"One thing have I desired of the Lord, that will I seek after; that I may dwell in the house of the Lord all the days of my life..."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Engagements Grid - Fixed to show images properly */}
      <section className="py-40 bg-[#fbfbfc]">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-24">
          <div className="text-center mb-24 space-y-4">
             <span className="text-vimGold font-black uppercase tracking-[0.4em] text-[10px]">THE SANCTUARY CLOCK</span>
             <h3 className="text-vimNavy font-serif text-5xl md:text-7xl font-black tracking-tighter">Weekly Engagements</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((s, idx) => (
              <div key={s.id} className="bg-white rounded-[3.5rem] shadow-premium border border-slate-100 hover:border-vimGold transition-all duration-700 group flex flex-col h-full overflow-hidden">
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={getServiceBackground(s, idx)} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" 
                    alt={s.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                </div>
                
                <div className="p-12 pt-4 flex flex-col flex-1 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-slate-50 text-vimNavy text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{s.time}</span>
                  </div>
                  <h4 className="text-vimNavy font-serif text-3xl font-black tracking-tighter mb-4 group-hover:text-vimGold transition-colors">{s.title}</h4>
                  <p className="text-gray-500 font-light leading-relaxed flex-1">
                    {s.description}
                  </p>
                  <div className="mt-10 pt-8 border-t border-slate-50">
                    <button className="text-[10px] font-black uppercase tracking-widest text-vimNavy flex items-center gap-3 group-hover:gap-5 transition-all">
                      PLAN VISIT <span className="text-vimGold">→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Children's Ministry Highlight */}
      <section className="py-40 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-24">
          <div className="bg-vimNavy rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row items-center gap-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-vimGold opacity-5 blur-[100px] -mr-32 -mt-32"></div>
            <div className="flex-1 space-y-8 relative z-10">
              <span className="text-vimGold font-black uppercase tracking-[0.4em] text-[10px]">Vibrant Kids Academy</span>
              <h3 className="text-white font-serif text-5xl md:text-7xl font-black tracking-tighter">Raising Future Giants</h3>
              <p className="text-white/50 text-xl font-light leading-relaxed">
                We provide a safe, high-energy environment where children learn the Word through creative arts, storytelling, and interactive play.
              </p>
              <button className="bg-white text-vimNavy px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-vimGold hover:text-white transition-all">
                LEARN ABOUT KIDS MINISTRY
              </button>
            </div>
            <div className="w-full lg:w-1/3 aspect-square rounded-[3rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Kids" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;