import React from 'react';
import { Store } from '../services/store';

interface FireNightSectionProps {
  countdown: { days: number; hours: number; mins: number; secs: number };
  onEnlist: () => void;
}

const FireNightSection: React.FC<FireNightSectionProps> = ({ countdown, onEnlist }) => {
  const settings = Store.getSettings();
  
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-vimNavy">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80" 
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          alt="Mountains"
        />
        <div className="absolute inset-0 bg-vimNavy/60"></div>
      </div>

      <div className="relative z-10 text-center space-y-16 px-8">
        <h2 className="text-white font-serif text-5xl md:text-8xl font-black tracking-tighter animate-in fade-in slide-in-from-bottom duration-1000 text-balance">
          {settings.fireNightHeading}
        </h2>

        {/* Large Countdown numerals */}
        <div className="flex justify-center gap-8 md:gap-16">
          {[
            { val: countdown.days, label: 'DAYS' },
            { val: countdown.hours, label: 'HOURS' },
            { val: countdown.mins, label: 'MINS' },
            { val: countdown.secs, label: 'SECS' },
          ].map((t, idx) => (
            <div key={t.label} className="text-center group animate-in zoom-in-50 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
              <p className="text-vimGold text-6xl md:text-8xl font-black italic tracking-tighter leading-none group-hover:scale-110 transition-transform">
                {t.val.toString().padStart(2, '0')}
              </p>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/40 mt-4">
                {t.label}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-8">
          <button 
            onClick={onEnlist}
            className="bg-vimGold text-vimNavy px-16 py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-premium hover:bg-white hover:scale-105 transition-all animate-in fade-in slide-in-from-top duration-1000 delay-500"
          >
            ENLIST FOR THE VIGIL
          </button>
        </div>
      </div>
    </section>
  );
};

export default FireNightSection;