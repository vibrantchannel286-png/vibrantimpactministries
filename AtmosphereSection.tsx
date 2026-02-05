import React from 'react';
import { Service } from '../types';
import { Store } from '../services/store';

interface AtmosphereSectionProps {
  services: Service[];
}

const AtmosphereSection: React.FC<AtmosphereSectionProps> = ({ services }) => {
  const settings = Store.getSettings();
  const allServices = [...services].sort((a, b) => a.order - b.order);

  const getBackground = (service: Service, index: number) => {
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

  const getDayLabel = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('sunday')) return 'Sunday';
    if (t.includes('tuesday')) return 'Tuesday';
    if (t.includes('friday')) return 'Friday';
    if (t.includes('vigil')) return 'Monthly';
    return 'Service';
  };

  return (
    <section className="bg-white py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-24">
        <div className="text-center mb-20 space-y-4">
          <span className="text-vimGold font-black uppercase tracking-[0.5em] text-[10px]">THE ATMOSPHERE</span>
          <h2 className="text-vimNavy font-serif text-4xl md:text-7xl font-black tracking-tighter leading-none">{settings.atmosphereHeading}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {allServices.map((service, idx) => (
            <div 
              key={service.id} 
              className="group relative h-[400px] md:h-[450px] rounded-[3rem] overflow-hidden shadow-premium transition-all duration-700 hover:-translate-y-2 hover:shadow-gold"
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src={getBackground(service, idx)} 
                  className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
                  alt={service.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-vimNavy/70 via-vimNavy/30 to-vimNavy/90 transition-all duration-500 group-hover:via-vimNavy/10 group-hover:to-vimNavy/95"></div>
              </div>

              <div className="absolute top-8 left-8 z-10">
                <h4 className="text-vimGold font-serif italic text-2xl md:text-3xl font-medium tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                  {getDayLabel(service.title)}
                </h4>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-10 z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10 group-hover:bg-vimGold/30 transition-colors"></div>
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{service.time}</span>
                </div>
                
                <h3 className="text-white text-2xl md:text-3xl font-serif font-black tracking-tighter leading-tight group-hover:text-vimGold transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-white/40 text-xs md:text-sm font-light leading-relaxed line-clamp-2 group-hover:text-white/70 transition-colors">
                  {service.description}
                </p>

                <div className="pt-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                   <button className="text-[9px] font-black text-vimGold uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all">
                      GET DIRECTIONS <span>→</span>
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
           <p className="text-gray-400 font-serif italic text-lg mb-8">Join us and be part of the move of the Spirit.</p>
           <button className="bg-slate-50 text-vimNavy px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-vimNavy hover:text-white transition-all shadow-sm border border-slate-100">
              Download Ministry Calendar
           </button>
        </div>
      </div>
    </section>
  );
};

export default AtmosphereSection;