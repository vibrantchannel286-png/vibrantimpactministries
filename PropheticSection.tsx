import React, { useState, useEffect } from 'react';
import { getPropheticWord } from '../services/gemini';
import { Store } from '../services/store';

const PropheticSection: React.FC = () => {
  const [word, setWord] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [mood, setMood] = useState<string>('seeking breakthrough');
  const settings = Store.getSettings();

  const fetchWord = async () => {
    setLoading(true);
    const theme = settings.themeOfMonth;
    const [result] = await Promise.all([
      getPropheticWord(mood, theme),
      new Promise(resolve => setTimeout(resolve, 600))
    ]);
    setWord(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchWord();
  }, [settings.themeOfMonth]);

  return (
    <div className="bg-vimNavy text-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-80 h-80 bg-vimGold opacity-[0.03] rounded-full -mr-40 -mt-40 blur-3xl group-hover:opacity-10 transition-all duration-1000"></div>
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-vimGold font-serif text-3xl font-black tracking-tighter flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-vimGold/10 flex items-center justify-center text-lg">🕊️</span>
              Prophetic Insight
            </h3>
            {settings.themeOfMonth && (
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-vimGold/40 ml-13">Theme: {settings.themeOfMonth}</p>
            )}
          </div>
          <span className="text-white/10 text-[10px] font-black uppercase tracking-[0.4em] hidden md:block">VIM Global Portal</span>
        </div>
        
        <div className="min-h-[160px] flex items-center">
          {loading ? (
            <div className="animate-pulse flex space-y-6 flex-col w-full">
              <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
              <div className="h-4 bg-white/5 rounded-full w-full"></div>
              <div className="h-4 bg-white/5 rounded-full w-5/6"></div>
            </div>
          ) : (
            <p className="text-2xl md:text-3xl italic font-light leading-snug text-blue-50/90 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              "{word}"
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6">
          <div className="flex-1">
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 mb-2 ml-1">Current Spiritual Need</p>
            <select 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-vimGold/50 outline-none transition-all text-xs font-bold appearance-none cursor-pointer"
            >
              <option value="seeking breakthrough">Breakthrough</option>
              <option value="joyful">Joy & Praise</option>
              <option value="tired or weary">Divine Rest</option>
              <option value="uncertain of the future">Guidance</option>
              <option value="grateful">Gratitude</option>
              <option value="suffering or in pain">Healing</option>
            </select>
          </div>
          <button 
            onClick={fetchWord}
            disabled={loading}
            className="bg-vimGold text-vimNavy px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-auto shadow-gold"
          >
            {loading ? 'Consulting...' : 'Refresh Word'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropheticSection;