import React, { useState, useEffect } from 'react';
import { getVisitGuide } from '../services/gemini';
import { Store } from '../services/store';

const VisitGuide: React.FC = () => {
  const [guide, setGuide] = useState<{text: string, links: any[]}>({ text: '', links: [] });
  const [loading, setLoading] = useState(true);
  const settings = Store.getSettings();

  useEffect(() => {
    const fetchGuide = async () => {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const res = await getVisitGuide(pos.coords.latitude, pos.coords.longitude);
          setGuide(res);
          setLoading(false);
        },
        async () => {
          const res = await getVisitGuide();
          setGuide(res);
          setLoading(false);
        }
      );
    };
    fetchGuide();
  }, []);

  return (
    <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-2 h-full bg-vimGold"></div>
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <span className="text-vimNavy font-black tracking-widest uppercase text-[10px] ml-1">Plan Your Sunday</span>
            <h3 className="text-vimNavy text-4xl md:text-5xl font-serif font-black tracking-tighter">Visiting Akure?</h3>
          </div>
          
          <div className="space-y-12">
            {/* Manual Admin Text */}
            <div className="bg-slate-50 p-8 rounded-[2rem] border-l-4 border-vimNavy/10">
              <p className="text-gray-600 leading-relaxed text-lg font-light italic">
                {settings.visitGuideText || "We can't wait to welcome you to our local assembly."}
              </p>
            </div>

            {/* AI Grounded Landmarks */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xl">🗺️</span>
                <p className="text-xs font-black uppercase tracking-widest text-vimNavy">Local Surroundings & Tips</p>
              </div>
              
              <div className="prose prose-slate text-gray-500 text-sm leading-relaxed">
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                  </div>
                ) : (
                  <p>{guide.text}</p>
                )}
              </div>

              {!loading && guide.links.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {guide.links.map((chunk, idx) => {
                    if (chunk.maps) {
                      return (
                        <a 
                          key={idx} 
                          href={chunk.maps.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white hover:bg-vimGold/10 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-vimNavy flex items-center gap-2 transition-all border border-gray-100 shadow-sm"
                        >
                          📍 {chunk.maps.title || 'View Landmark'}
                        </a>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3 bg-vimNavy text-white p-10 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-vimGold opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-all duration-700"></div>
          <h4 className="text-vimGold font-serif font-black text-2xl tracking-tight">At a Glance</h4>
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Location</p>
              <p className="text-sm font-medium">{settings.address}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Primary Service</p>
              <p className="text-sm font-medium">Sunday Glory: 9:00 AM</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Contact</p>
              <p className="text-sm font-medium">{settings.phone}</p>
            </div>
            <button className="w-full bg-white text-vimNavy py-4 rounded-xl font-black text-[10px] uppercase tracking-widest mt-4 hover:bg-vimGold hover:text-white transition-all shadow-xl">
              REQUEST A SHUTTLE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitGuide;