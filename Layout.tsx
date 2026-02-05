import React, { useState, useEffect, useRef } from 'react';
import { Page, ChurchSettings, MediaItem, Service, Department } from '../types';
import { Store } from '../services/store';

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
  isLive?: boolean;
  settings: ChurchSettings;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate, isLive = false, settings }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ type: string; title: string; id: string; page: Page }[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const media = Store.getMedia();
      const services = Store.getServices();
      const departments = Store.getDepartments();

      const results: any[] = [];
      media.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .forEach(m => results.push({ type: 'Sermon', title: m.title, id: m.id, page: Page.Media }));
      services.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .forEach(s => results.push({ type: 'Service', title: s.title, id: s.id, page: Page.Services }));
      departments.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .forEach(d => results.push({ type: 'Ministry Arm', title: d.name, id: d.id, page: Page.Departments }));

      setSearchResults(results.slice(0, 8));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const navItems = [
    { id: Page.Home, label: 'Home' },
    { id: Page.About, label: 'Our Story' },
    { id: Page.Services, label: 'Experience' },
    { id: Page.Media, label: 'Library' },
    { id: Page.Giving, label: 'Partnership' },
    { id: Page.Contact, label: 'Contact' },
  ];

  const socialIcons = [
    { 
      id: 'FB', 
      url: settings.facebookUrl, 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
    },
    { 
      id: 'YT', 
      url: settings.youtubeUrl, 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    },
    { 
      id: 'TT', 
      url: settings.tiktokUrl, 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.3a3.81 3.81 0 0 0-1.65 2.6c-.16.91.07 1.86.64 2.57.57.7 1.43 1.17 2.33 1.27.91.1 1.84-.13 2.58-.68.85-.63 1.34-1.65 1.38-2.71.02-3.15-.01-6.31.02-9.47z"/></svg>
    },
    { 
      id: 'WA', 
      url: settings.whatsappUrl, 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 .004 5.411.001 12.049a11.81 11.81 0 0 0 1.602 6.002L0 24l6.163-1.617a11.83 11.83 0 0 0 5.883 1.564h.005c6.634 0 12.044-5.41 12.047-12.049a11.79 11.79 0 0 0-3.483-8.513z"/></svg>
    },
    { 
      id: 'TW', 
      url: settings.twitchUrl, 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
    },
  ].filter(s => s.url);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {isLive && (
        <div className="bg-red-600 text-white py-2 px-4 text-center text-[10px] font-black tracking-[0.3em] sticky top-0 z-[120] animate-pulse flex items-center justify-center gap-4 shadow-xl">
          <span className="flex h-2 w-2 rounded-full bg-white animate-ping"></span>
          LIVE STREAMING NOW • EXPERIENCE THE MOVE OF GOD
          {settings.liveVideoUrl && (
            <a href={settings.liveVideoUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-red-600 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest hover:bg-vimNavy hover:text-white transition-all ml-2 shadow-sm">
              Watch Live Stream
            </a>
          )}
        </div>
      )}

      <header className={`fixed ${isLive ? 'top-8' : 'top-0'} w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white shadow-premium py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto flex justify-between items-center px-8 lg:px-12">
          <div className="flex items-center gap-4 cursor-pointer relative group" onClick={() => onNavigate(Page.Home)}>
            <div className="relative">
              <img src={settings.logoUrl} alt="Logo" className={`transition-all duration-500 rounded-full border border-vimGold/20 ${scrolled ? 'w-10 h-10' : 'w-14 h-14'}`} />
              {isLive && <div className="absolute -inset-1 rounded-full border-2 border-red-500 animate-ping opacity-20"></div>}
            </div>
            <div className={scrolled ? 'hidden md:block' : 'block'}>
              <div className="flex items-center gap-3">
                <h1 className={`font-serif font-black tracking-tighter leading-none transition-colors ${scrolled ? 'text-vimNavy text-xl' : 'text-white text-2xl'}`}>{settings.name}</h1>
                {isLive && (
                  <div className="flex items-center gap-1.5 bg-red-600 px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30 animate-in zoom-in-50 duration-500 border border-white/20">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">LIVE</span>
                  </div>
                )}
              </div>
              <p className={`text-[8px] uppercase tracking-[0.4em] mt-1 font-bold ${scrolled ? 'text-vimGold' : 'text-white/60'}`}>{settings.slogan}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-8 border-r border-current/10 pr-8 mr-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`text-[11px] uppercase tracking-[0.2em] font-black transition-all hover:text-vimGold ${
                    activePage === item.id 
                      ? 'text-vimGold' 
                      : (scrolled ? 'text-vimNavy' : 'text-white')
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <button onClick={() => setSearchOpen(true)} className={`p-2 hover:text-vimGold transition-colors ${scrolled ? 'text-vimNavy' : 'text-white'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <button onClick={() => onNavigate(Page.Auth)} className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${scrolled ? 'bg-vimNavy text-white border-vimNavy shadow-lg shadow-vimNavy/10' : 'bg-white/10 text-white border-white/20 hover:bg-white hover:text-vimNavy'}`}>
                VIM Portal
              </button>
            </div>
          </nav>

          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className={`p-2 transition-colors ${scrolled ? 'text-vimNavy' : 'text-white'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button className={`flex items-center gap-3 relative z-[110] p-2 ${scrolled ? 'text-vimNavy' : 'text-white'}`} onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}>
              <div className="space-y-1.5 w-6">
                <div className={`w-full h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`w-full h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-full h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        <div className={`fixed inset-0 z-[150] transition-all duration-500 bg-white/95 backdrop-blur-xl ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="max-w-4xl mx-auto pt-32 px-8">
            <div className="flex justify-between items-center mb-16">
               <h2 className="text-vimNavy text-3xl font-serif font-black tracking-tighter">Search the Archives</h2>
               <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-vimNavy hover:text-vimGold transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
            <input ref={searchInputRef} type="text" placeholder="Find sermons..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent border-b-2 border-vimNavy/10 focus:border-vimGold outline-none py-6 text-2xl md:text-4xl font-serif italic text-vimNavy transition-all" />
            <div className="mt-12 space-y-4">
               {searchResults.length > 0 && searchResults.map((result, idx) => (
                 <button key={idx} onClick={() => { onNavigate(result.page); setSearchOpen(false); setSearchQuery(''); }} className="w-full flex items-center justify-between p-6 rounded-3xl bg-slate-50 hover:bg-vimGold/10 transition-all text-left">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-vimGold">{result.type}</p>
                      <h4 className="text-vimNavy font-black text-xl">{result.title}</h4>
                   </div>
                   <span>→</span>
                 </button>
               ))}
            </div>
          </div>
        </div>

        <div className={`fixed inset-0 bg-vimNavy z-[100] transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none invisible'}`}>
          <div className="h-full flex flex-col px-10 py-20 overflow-y-auto">
            <nav className="flex flex-col gap-6 md:gap-8 flex-1">
              {navItems.map((item, idx) => (
                <button key={item.id} onClick={() => { onNavigate(item.id); setMenuOpen(false); }} className={`text-left text-5xl md:text-7xl font-serif font-black tracking-tighter hover:text-vimGold transition-all duration-500`} style={{ color: activePage === item.id ? '#d4af37' : 'white' }}>{item.label}</button>
              ))}
            </nav>
            <div className="pt-10 border-t border-white/5 mt-8">
               <button onClick={() => { onNavigate(Page.Auth); setMenuOpen(false); }} className="w-full gold-gradient text-vimNavy py-6 rounded-3xl text-sm font-black uppercase tracking-[0.2em]">Admin Portal Access</button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-[#05080d] text-white pt-32 pb-24 px-8 lg:px-24 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto space-y-20">
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-6">
              <img src={settings.logoUrl} className="w-10 h-10 object-contain brightness-200" alt="Logo" />
              <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tight leading-none">{settings.name}</h2>
            </div>
            <p className="text-vimGold font-black uppercase tracking-[0.4em] text-[10px] ml-16 -mt-6">
              {settings.slogan.toUpperCase()}
            </p>
            
            <p className="text-white/40 text-lg font-light max-w-2xl leading-relaxed mt-4 ml-16">
              {settings.footerAboutText}
            </p>
            
            <div className="flex gap-4 mt-8 ml-16">
              {socialIcons.map(s => (
                <a 
                  key={s.id} 
                  href={s.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center hover:bg-vimGold hover:text-vimNavy transition-all text-white/60 hover:text-vimNavy"
                  title={s.id}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="ml-16 space-y-12">
            <div className="space-y-8">
              <h4 className="text-vimGold font-black uppercase tracking-[0.3em] text-[10px]">MINISTRY HUB</h4>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <span className="text-red-600 mt-1">📍</span>
                  <p className="text-white/60 text-base font-light group-hover:text-white transition-colors">{settings.address}</p>
                </div>
                
                <div className="flex items-center gap-4 group">
                  <span className="text-red-600">📞</span>
                  <p className="text-white/60 text-base font-light group-hover:text-white transition-colors">{settings.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto mt-32 pt-12 border-t border-white/5">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">&copy; {new Date().getFullYear()} {settings.name}. All Sovereignty to God.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;